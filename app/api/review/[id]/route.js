import connectDB from "@/lib/mongodb";
import Review from "@/models/review";
import User from "@/models/user";
import Cruise from "@/models/cruise";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const review = await Review.findById(params.id)
      .populate("userId", "name email")
      .populate("cruiseId", "title location images.main");
    
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

    const { userId, cruiseId, rating, comment } = data;
    if (!userId || !rating || !comment) {
      return new Response(JSON.stringify({ error: "User ID, rating, and comment are required" }), { status: 400 });
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ error: "Rating must be between 1 and 5" }), { status: 400 });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Check if cruise exists (only if cruiseId is provided)
    if (cruiseId) {
      const cruise = await Cruise.findById(cruiseId);
      if (!cruise) {
        return new Response(JSON.stringify({ error: "Cruise not found" }), { status: 404 });
      }
    }

    const updateData = {
      userId,
      rating,
      comment,
    };

    // Only add cruiseId if it's provided, otherwise remove it
    if (cruiseId) {
      updateData.cruiseId = cruiseId;
    } else {
      updateData.cruiseId = null;
    }

    const review = await Review.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true }
    )
    .populate("userId", "name email")
    .populate("cruiseId", "title location images.main");

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
