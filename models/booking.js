import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cruiseId: { type: mongoose.Schema.Types.ObjectId, ref: "Cruise", required: false }, // Added for cruise-specific bookings
    cruiseDate: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
    packageType: { type: String, required: true, default: "SUNSET Cruise Ticket at Asiatique Pier" },
    cruisingTime: { type: String, required: true, default: "17:00-18:30" },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
