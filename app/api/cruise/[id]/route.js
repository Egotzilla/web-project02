import connectDB from "@/lib/mongodb";
import Cruise from "@/models/cruise";

export async function GET(req, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const cruise = await Cruise.findById(id);

    if (!cruise) {
      return new Response(JSON.stringify({ error: "Cruise not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(cruise), { status: 200 });
  } catch (err) {
    console.error('Error fetching cruise:', err);
    return new Response(JSON.stringify({ error: "Failed to fetch cruise" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    const data = await req.json();

    // Validate price if provided
    if (data.price !== undefined && data.price <= 0) {
      return new Response(JSON.stringify({ error: "Price must be greater than 0" }), { status: 400 });
    }

    // Update cruise
    const updatedCruise = await Cruise.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedCruise) {
      return new Response(JSON.stringify({ error: "Cruise not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(updatedCruise), { status: 200 });
  } catch (err) {
    console.error('Error updating cruise:', err);
    return new Response(JSON.stringify({ error: "Failed to update cruise" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    
    const { id } = params;
    
    // Soft delete by setting isActive to false
    const updatedCruise = await Cruise.findByIdAndUpdate(
      id,
      { $set: { isActive: false } },
      { new: true }
    );

    if (!updatedCruise) {
      return new Response(JSON.stringify({ error: "Cruise not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Cruise deactivated successfully" }), { status: 200 });
  } catch (err) {
    console.error('Error deleting cruise:', err);
    return new Response(JSON.stringify({ error: "Failed to delete cruise" }), { status: 500 });
  }
}