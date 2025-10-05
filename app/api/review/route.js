import connectDB from "@/lib/mongodb";
import Review from "@/models/review";
import User from "@/models/user";
import Cruise from "@/models/cruise";

export async function GET(req) {
  try {
    await connectDB();
    // Populate user and cruise info in reviews (cruise might be null for old reviews)
    const reviews = await Review.find()
      .populate("userId", "name email")
      .populate("cruiseId", "title location images.main")
      .sort({ createdAt: -1 });
    return new Response(JSON.stringify(reviews), { status: 200 });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch reviews" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    console.log('POST /api/review - Starting request...');
    await connectDB();
    console.log('Database connected successfully');
    
    const data = await req.json();
    console.log('Request data:', data);

    const { userId, cruiseId, rating, comment } = data;
    if (!userId || !rating || !comment) {
      console.log('Missing required fields:', { userId: !!userId, rating: !!rating, comment: !!comment });
      return new Response(JSON.stringify({ error: "User ID, rating, and comment are required" }), { status: 400 });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      console.log('Invalid rating:', rating);
      return new Response(JSON.stringify({ error: "Rating must be between 1 and 5" }), { status: 400 });
    }

    // Check if user exists
    console.log('Checking if user exists with ID:', userId);
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found with ID:', userId);
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
    console.log('User found:', user.name);

    // Check if cruise exists (only if cruiseId is provided)
    if (cruiseId) {
      console.log('Checking if cruise exists with ID:', cruiseId);
      const cruise = await Cruise.findById(cruiseId);
      if (!cruise) {
        console.log('Cruise not found with ID:', cruiseId);
        return new Response(JSON.stringify({ error: "Cruise not found" }), { status: 404 });
      }
      console.log('Cruise found:', cruise.title);
    }

    const reviewData = {
      userId,
      rating,
      comment,
    };
    
    // Only add cruiseId if it's provided
    if (cruiseId) {
      reviewData.cruiseId = cruiseId;
    }

    console.log('Creating review with data:', reviewData);
    const review = await Review.create(reviewData);
    console.log('Review created successfully:', review._id);

    // Populate user and cruise info in response
    console.log('Populating review data...');
    const populatedReview = await Review.findById(review._id)
      .populate("userId", "name email")
      .populate("cruiseId", "title location images.main");

    console.log('Review populated successfully');
    return new Response(JSON.stringify(populatedReview), { status: 201 });
  } catch (err) {
    console.error("Error creating review:", err);
    console.error("Error stack:", err.stack);
    return new Response(JSON.stringify({ error: "Failed to create review", details: err.message }), { status: 500 });
  }
}
