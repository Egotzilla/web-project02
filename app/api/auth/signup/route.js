import connectDB from "@/lib/mongodb";
import User from "@/models/user";

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, phone } = await req.json();

    // Validate required fields
    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Name, email, and password are required" }), 
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User already exists with this email" }), 
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'customer'
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return new Response(
      JSON.stringify({ 
        message: "User created successfully", 
        user: userWithoutPassword 
      }), 
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create user" }), 
      { status: 500 }
    );
  }
}
