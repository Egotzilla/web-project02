import connectDB from "../../../lib/mongodb";
import Package from "../../../models/package";

export async function GET(req) {
  try {
    await connectDB();

    // Get all packages, sorted by creation date
    const packages = await Package.find().sort({ createdAt: -1 });

    return new Response(JSON.stringify(packages), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch packages" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate required fields
    const { name, description, cruisingTime, location } = data;
    if (!name || !description || !cruisingTime || !location) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Create new package
    const newPackage = await Package.create({
      name,
      description,
      cruisingTime,
      location,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    return new Response(JSON.stringify(newPackage), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create package" }), { status: 500 });
  }
}