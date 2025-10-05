import connectDB from "@/lib/mongodb";
import Booking from "@/models/booking";
import User from "@/models/user";
import Cruise from "@/models/cruise";

export async function GET(req) {
  try {
    await connectDB();
    console.log('Fetching all bookings...');

    // Populate user info and cruise info in bookings
    const bookings = await Booking.find()
      .populate({
        path: "userId",
        select: "name email phone",
        options: { strictPopulate: false }
      })
      .populate({
        path: "cruiseId",
        select: "title location",
        options: { strictPopulate: false }
      });

    console.log(`Found ${bookings.length} bookings`);
    
    // Debug: Log each booking's cruise info
    bookings.forEach((booking, index) => {
      console.log(`Booking ${index + 1}:`, {
        id: booking._id,
        cruiseId: booking.cruiseId,
        cruiseTitle: booking.cruiseId?.title,
        packageType: booking.packageType
      });
    });

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch bookings" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log('POST /api/booking - Starting request...');
    await connectDB();
    console.log('Database connected successfully');
    
    const data = await req.json();
    console.log('Request data:', data);

    // Validate required fields
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

    const bookingData = {
      userId,
      cruiseId: cruiseId || null,
      cruiseDate: new Date(cruiseDate),
      numberOfGuests,
      packageType: packageType || "SUNSET Cruise Ticket at Asiatique Pier",
      cruisingTime: cruisingTime || "17:00-18:30",
    };

    console.log('Creating booking with data:', bookingData);
    const booking = await Booking.create(bookingData);
    console.log('Booking created successfully:', booking._id);

    return new Response(JSON.stringify(booking), { status: 201 });
  } catch (err) {
    console.error("Error creating booking:", err);
    console.error("Error stack:", err.stack);
    return new Response(JSON.stringify({ error: "Failed to create booking", details: err.message }), { status: 500 });
  }
}
