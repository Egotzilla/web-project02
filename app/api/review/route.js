import connectDB from "../../../lib/mongodb";
import Review from "../../../models/review";
import User from "../../../models/user";

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

    // Check if user exists
    const user = await User.findById(customerId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
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
