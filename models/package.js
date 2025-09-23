import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    cruisingTime: { type: String, required: true },
    location: { type: String, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Package = mongoose.models.Package || mongoose.model("Package", packageSchema);

export default Package;