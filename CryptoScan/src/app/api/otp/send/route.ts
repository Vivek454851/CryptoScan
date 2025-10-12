// src/app/api/otp/send/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { generateOtp } from "@/lib/otp";
import { sendOtpMail } from "@/lib/mailer";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (user.isVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    // generate new OTP
    const rawOtp = generateOtp(6);
    const otpCodeHash = await bcrypt.hash(rawOtp, 12);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // update user document
    user.otpCodeHash = otpCodeHash;
    user.otpExpiry = otpExpiry;
    user.otpAttempts = 0;
    await user.save();

    // send the OTP email
    await sendOtpMail(email, rawOtp);

    return NextResponse.json({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.error("otp send error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
