import connectDB from "../../../../lib/mongodb";
import User from "../../../../models/user";

export async function POST(req) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    // Validate required fields
    if (!username || !password) {
      return new Response(
        JSON.stringify({ error: "Username and password are required" }), 
        { status: 400 }
      );
    }

    // Check for hardcoded admin credentials
    if (username === 'admin' && password === 'admin') {
      // Create or find admin user
      let adminUser = await User.findOne({ email: 'admin@cruise.com' });
      
      if (!adminUser) {
        adminUser = await User.create({
          name: 'Admin',
          email: 'admin@cruise.com',
          password: 'admin',
          role: 'admin'
        });
      }

      // For hardcoded admin, we know the password is correct, so we can proceed
      // Remove password from response
      const { password: _, ...adminWithoutPassword } = adminUser.toObject();

      return new Response(
        JSON.stringify({ 
          message: "Admin login successful", 
          user: adminWithoutPassword 
        }), 
        { status: 200 }
      );
    }

    // If not hardcoded admin, check database for admin users
    const adminUser = await User.findOne({ 
      $or: [
        { email: username, role: 'admin' },
        { name: username, role: 'admin' }
      ]
    });

    if (!adminUser) {
      return new Response(
        JSON.stringify({ error: "Invalid admin credentials" }), 
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await adminUser.comparePassword(password);
    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({ error: "Invalid admin credentials" }), 
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = adminUser.toObject();

    return new Response(
      JSON.stringify({ 
        message: "Admin login successful", 
        user: adminWithoutPassword 
      }), 
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return new Response(
      JSON.stringify({ error: "Admin login failed" }), 
      { status: 500 }
    );
  }
}
