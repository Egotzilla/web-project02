import connectDB from "../../../lib/mongodb";
import Customer from "../../../models/customer";

export async function GET(req) {
  try {
    await connectDB();
    const customers = await Customer.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify(customers), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch customers" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();

    const { name, email, phone } = data;
    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), { status: 400 });
    }

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
    });

    return new Response(JSON.stringify(customer), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to create customer" }), { status: 500 });
  }
}
