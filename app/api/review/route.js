import connectDB from "../../../lib/mongodb";
import Review from "../../../models/review";
import Customer from "../../../models/customer";

export async function GET(req) {
  try {
    await connectDB();
    // Populate customer info in reviews
    const reviews = await Review.find().populate("customerId", "name email").sort({ createdAt: -1 });
    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), { status: 500 });
  }
}

export async function POST(req) {
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

    const review = await Review.create({
      customerId,
      rating,
      comment,
    });

    // Populate customer info in response
    const populatedReview = await Review.findById(review._id).populate("customerId", "name email");

    return new Response(JSON.stringify(populatedReview), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create review" }), { status: 500 });
  }
}
