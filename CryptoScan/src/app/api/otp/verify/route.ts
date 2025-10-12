import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, code } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check OTP expiry
    if (!user.otpCodeHash || !user.otpExpiry || new Date() > user.otpExpiry) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Compare hashed OTP
    const isMatch = await bcrypt.compare(code, user.otpCodeHash);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // OTP is valid → verify user
    user.isVerified = true;
    user.otpCodeHash = undefined;
    user.otpExpiry = undefined;
    user.otpAttempts = 0;
    await user.save();
    

    return NextResponse.json({ success: true, message: "Email verified!" });
  } catch (err) {
    console.error("OTP verify error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
