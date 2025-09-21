import connectDB from "../../../../lib/mongodb";
import Review from "../../../../models/review";
import Customer from "../../../../models/customer";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const review = await Review.findById(params.id).populate("customerId", "name email");
    
    if (!review) {
      return new Response(JSON.stringify({ error: "Review not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(review), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch review" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const data = await req.json();

    const { customerId, rating, comment } = data;
    if (!customerId || !rating || !comment) {
      return new Response(JSON.stringify({ error: "Customer ID, rating, and comment are required" }), { status: 400 });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: "Rating must be between 1 and 5" }), { status: 400 });
    }

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
    }

    const review = await Review.findByIdAndUpdate(
      params.id,
      { customerId, rating, comment },
      { new: true }
    ).populate("customerId", "name email");

    if (!review) {
      return new Response(JSON.stringify({ error: "Review not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(review), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update review" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const review = await Review.findByIdAndDelete(params.id);
    
    if (!review) {
      return new Response(JSON.stringify({ error: "Review not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Review deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete review" }), { status: 500 });
  }
}
