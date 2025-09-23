import connectDB from "../../../lib/mongodb";
import Booking from "../../../models/booking";
import User from "../../../models/user";

export async function GET(req) {
  try {
    await connectDB();

    // Populate customer info in bookings
    const bookings = await Booking.find().populate("customerId", "name email phone");

    return new Response(JSON.stringify(bookings), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch bookings" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate required fields
    const { customerId, cruiseDate, numberOfGuests, packageType, cruisingTime } = data;
    if (!customerId || !cruiseDate || !numberOfGuests) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Check if user exists
    const user = await User.findById(customerId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const booking = await Booking.create({
      customerId,
      cruiseDate: new Date(cruiseDate),
      numberOfGuests,
      packageType: packageType || "SUNSET Cruise Ticket at Asiatique Pier",
      cruisingTime: cruisingTime || "17:00-18:30",
    });

    return new Response(JSON.stringify(booking), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create booking" }), { status: 500 });
  }
}
