import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cruiseDate: { type: Date, required: true },
    numberOfGuests: { type: Number, required: true },
    packageType: { type: String, required: true, default: "SUNSET Cruise Ticket at Asiatique Pier" },
    cruisingTime: { type: String, required: true, default: "17:00-18:30" },
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
