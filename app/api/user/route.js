import connectDB from "../../../lib/mongodb";
import User from "../../../models/user";

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({ role: "customer" }, "name email phone");
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch users" }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, phone } = await req.json();

    if (!name || !email) {
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email,
      phone,
      role: "customer"
    });

    return new Response(JSON.stringify(user), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create user" }),
      { status: 500 }
    );
  }
}