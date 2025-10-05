import connectDB from "@/lib/mongodb";
import Booking from "@/models/booking";
import User from "@/models/user";
import Cruise from "@/models/cruise";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const booking = await Booking.findById(resolvedParams.id)
      .populate("userId", "name email phone")
      .populate({
        path: "cruiseId",
        select: "title location",
        options: { strictPopulate: false }
      });
    
    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(booking), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch booking" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    console.log('PUT /api/booking/[id] - Starting request...');
    const resolvedParams = await params;
    console.log('Booking ID:', resolvedParams.id);
    
    await connectDB();
    console.log('Database connected successfully');
    
    const data = await req.json();
    console.log('Request data:', data);

    const { userId, cruiseId, cruiseDate, numberOfGuests, packageType, cruisingTime } = data;
    if (!userId || !cruiseDate || !numberOfGuests) {
      console.log('Missing required fields:', { 
        userId: !!userId, 
        cruiseDate: !!cruiseDate, 
        numberOfGuests: !!numberOfGuests 
      });
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Check if user exists
    console.log('Checking if user exists with ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    console.log('User found:', user.name);

    // Check if booking exists before updating
    const existingBooking = await Booking.findById(resolvedParams.id);
    if (!existingBooking) {
      console.log('Booking not found with ID:', resolvedParams.id);
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
    }
    console.log('Found existing booking:', existingBooking._id);

    const updateData = {
      userId,
      cruiseId: cruiseId || null,
      cruiseDate: new Date(cruiseDate),
      numberOfGuests,
      packageType: packageType || "SUNSET Cruise Ticket at Asiatique Pier",
      cruisingTime: cruisingTime || "17:00-18:30",
    };
    
    console.log('Updating booking with data:', updateData);

    const booking = await Booking.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      { new: true, runValidators: true, context: 'query' }
    );

    if (!booking) {
      console.log('Booking not found after update with ID:', resolvedParams.id);
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
    }

    // Manually populate the fields to avoid schema issues
    let populatedBooking = booking.toObject();
    
    // Populate user
    if (booking.userId) {
      const user = await User.findById(booking.userId).select('name email phone');
      populatedBooking.userId = user;
    }
    
    // Populate cruise if it exists
    if (booking.cruiseId) {
      try {
        const cruise = await Cruise.findById(booking.cruiseId).select('title location');
        populatedBooking.cruiseId = cruise;
      } catch (err) {
        console.log('Could not populate cruise:', err.message);
        populatedBooking.cruiseId = null;
      }
    }

    console.log('Booking updated successfully:', booking._id);
    return new Response(JSON.stringify(populatedBooking), { status: 200 });
  } catch (err) {
    console.error('Error in PUT /api/booking/[id]:', err);
    console.error('Error stack:', err.stack);
    return new Response(JSON.stringify({ error: "Failed to update booking", details: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const resolvedParams = await params;
    const booking = await Booking.findByIdAndDelete(resolvedParams.id);
    
    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Booking deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete booking" }), { status: 500 });
  }
}
