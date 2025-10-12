import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword } from "@/lib/password";

const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) return null;

        const ident = credentials.identifier.toString().trim().toLowerCase();

        await connectDB();

        // ✅ Find by email OR username
        const user = await User.findOne({
          $or: [{ email: ident }, { username: ident }],
        });

        if (!user) throw new Error("Invalid username/email or password");
        if (!user.isVerified) throw new Error("Email not verified");

        const ok = await verifyPassword(credentials.password, user.passwordHash);
        if (!ok) throw new Error("Invalid username/email or password");

        return {
          id: String(user._id),
          name: user.name,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
