import connectDB from "../../../../lib/mongodb";
import Customer from "../../../../models/customer";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const customer = await Customer.findById(params.id);
    
    if (!customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch customer" }), { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const data = await req.json();

    const { name, email, phone } = data;
    if (!name || !email) {
      return new Response(JSON.stringify({ error: "Name and email are required" }), { status: 400 });
    }

    // Check if email already exists for another customer
    const existingCustomer = await Customer.findOne({ 
      email, 
      _id: { $ne: params.id } 
    });
    if (existingCustomer) {
      return new Response(JSON.stringify({ error: "Email already exists" }), { status: 400 });
    }

    const customer = await Customer.findByIdAndUpdate(
      params.id,
      { name, email, phone },
      { new: true }
    );

    if (!customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(customer), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update customer" }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const customer = await Customer.findByIdAndDelete(params.id);
    
    if (!customer) {
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Customer deleted successfully" }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete customer" }), { status: 500 });
  }
}
