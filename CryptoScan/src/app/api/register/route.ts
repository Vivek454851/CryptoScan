// src/app/api/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword } from "@/lib/password";
import { generateOtp } from "@/lib/otp";
import { sendOtpMail } from "@/lib/mailer";
import bcrypt from "bcryptjs";

// Define a type for MongoDB duplicate key errors
interface MongoDuplicateKeyError extends Error {
  code: number;
  keyValue: Record<string, string>;
}

export async function POST(req: Request) {
  try {
    const { name, username, email, password } = await req.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // basic username validation
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return NextResponse.json(
        { error: "Invalid username (3-20 letters, numbers, underscore)" },
        { status: 400 }
      );
    }

    await connectDB();

    // check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() }],
    });

    if (existingUser) {
      if (existingUser.username === username.toLowerCase()) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    // generate OTP
    const rawOtp = generateOtp(6);
    const otpCodeHash = await bcrypt.hash(rawOtp, 12);
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // create user with embedded OTP
    await User.create({
      username: username.toLowerCase(),
      name,
      email: email.toLowerCase(),
      passwordHash,
      isVerified: false,
      otpCodeHash,
      otpExpiry,
      otpAttempts: 0,
    });

    // send email with OTP
    await sendOtpMail(email, rawOtp);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    console.error("register error", err);

    // Check if it's a Mongo duplicate key error
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as MongoDuplicateKeyError).code === 11000
    ) {
      const mongoErr = err as MongoDuplicateKeyError;
      const key = Object.keys(mongoErr.keyValue || {})[0];
      return NextResponse.json(
        { error: `${key || "Field"} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
