import connectDB from "../../../../lib/mongodb";
import Booking from "../../../../models/booking";
import User from "../../../../models/user";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const booking = await Booking.findById(params.id).populate("customerId", "name email phone");
    
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
    await connectDB();
    const data = await req.json();

    const { customerId, cruiseDate, numberOfGuests, packageType, cruisingTime } = data;
    if (!customerId || !cruiseDate || !numberOfGuests) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Check if user exists
    const user = await User.findById(customerId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const booking = await Booking.findByIdAndUpdate(
      params.id,
      {
        customerId,
        cruiseDate: new Date(cruiseDate),
        numberOfGuests,
        packageType: packageType || "SUNSET Cruise Ticket at Asiatique Pier",
        cruisingTime: cruisingTime || "17:00-18:30",
      },
      { new: true }
    ).populate("customerId", "name email phone");

    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(booking), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update booking" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const booking = await Booking.findByIdAndDelete(params.id);
    
    if (!booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Booking deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete booking" }), { status: 500 });
  }
}
