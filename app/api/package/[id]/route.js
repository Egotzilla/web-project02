import connectDB from "@/lib/mongodb";
import Package from "@/models/package";
import { isValidObjectId } from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ error: "Invalid package ID" }), { status: 400 });
    }

    const packageData = await Package.findById(id);
    if (!packageData) {
      return new Response(JSON.stringify({ error: "Package not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(packageData), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch package" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await req.json();

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ error: "Invalid package ID" }), { status: 400 });
    }

    // Validate required fields
    const { name, description, cruisingTime, location } = data;
    if (!name || !description || !cruisingTime || !location) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      {
        name,
        description,
        cruisingTime,
        location,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      { new: true }
    );

    if (!updatedPackage) {
      return new Response(JSON.stringify({ error: "Package not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedPackage), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update package" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return new Response(JSON.stringify({ error: "Invalid package ID" }), { status: 400 });
    }

    const deletedPackage = await Package.findByIdAndDelete(id);
    if (!deletedPackage) {
      return new Response(JSON.stringify({ error: "Package not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Package deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete package" }), { status: 500 });
  }
}