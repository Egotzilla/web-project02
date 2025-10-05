import connectDB from "@/lib/mongodb";
import Cruise from "@/models/cruise";

export async function GET(req) {
  try {
    await connectDB();
    
    // Get all active cruises, sorted by creation date
    const cruises = await Cruise.find({ isActive: true }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(cruises), { status: 200 });
  } catch (err) {
    console.error('Error fetching cruises:', err);
    return new Response(JSON.stringify({ error: "Failed to fetch cruises" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate required fields
    const { title, description, price, duration, location } = data;
    if (!title || !description || !price || !duration || !location) {
      return new Response(JSON.stringify({ error: "Missing required fields: title, description, price, duration, location" }), { status: 400 });
    }

    // Validate price
    if (price <= 0) {
      return new Response(JSON.stringify({ error: "Price must be greater than 0" }), { status: 400 });
    }

    // Create new cruise with default values
    const newCruise = await Cruise.create({
      title,
      description,
      tag: data.tag || 'Bangkok',
      price,
      currency: data.currency || 'THB',
      duration,
      location,
      features: data.features || ['English', 'Join in group', 'Meet at location'],
      highlights: data.highlights || [],
      images: {
        main: data.images?.main || '/img/wp1.png',
        gallery: data.images?.gallery || ['/img/wp1.png', '/img/wp2.png', '/img/wp3.png', '/img/wp4.png', '/img/wp5.png']
      },
      isActive: data.isActive !== undefined ? data.isActive : true,
      capacity: data.capacity || 100,
      rating: data.rating || 4.5,
      totalReviews: data.totalReviews || 0,
      totalBookings: data.totalBookings || 0
    });

    return new Response(JSON.stringify(newCruise), { status: 201 });
  } catch (err) {
    console.error('Error creating cruise:', err);
    return new Response(JSON.stringify({ error: "Failed to create cruise" }), { status: 500 });
  }
}