"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const [identifier, setIdentifier] = useState(""); // username or email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // signIn will call our NextAuth credentials authorize()
    const res = await signIn("credentials", {
      identifier: identifier.trim(),
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) setError(res.error);
    else if (res?.ok) window.location.href = "/dashboard";
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
        {/* Left Panel */}
        <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 text-white md:flex p-10 relative">
          <div className="mb-6 text-6xl">🏆</div>
          <h2 className="mb-3 text-3xl font-bold">CryptoGuard AI</h2>
          <p className="max-w-md text-center text-lg opacity-90">
            Advanced Cryptographic Algorithm Detection & Analysis Platform
          </p>

          <div className="mt-8 flex gap-3">
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">🤖 AI-Powered</span>
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">⚡ Real-time</span>
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">🔒 Secure</span>
          </div>

          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          </div>
        </div>

        {/* Right Panel (form) */}
        <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2">
          <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl bg-white p-8">
            <h1 className="mb-2 text-2xl font-bold text-purple-600">Welcome to CryptoGuard AI</h1>
            <p className="mb-6 text-sm text-gray-500">Sign in with your username or email</p>

            {error && <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600">{error}</div>}

            {/* Identifier (username or email) */}
            <label className="mb-2 block text-sm font-medium text-gray-700">Username or Email</label>
            <div className="relative mb-4">
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="username or email"
                className="text-black placeholder-gray-200 w-full rounded-lg border px-4 py-3 pr-10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
              <span className="absolute right-3 top-3 text-xl">👤</span>
            </div>

            {/* Password with eye */}
            <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="text-black placeholder-gray-200 w-full rounded-lg border px-4 py-3 pr-10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xl"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white shadow hover:bg-purple-500 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "🚀 Sign In"}
            </button>

            <p className="mb-6 text-center text-sm text-gray-600">
              New to CryptoGuard AI? <a href="/sign-up" className="font-medium text-purple-600">Create Account</a>
            </p>

            <div className="rounded-lg bg-purple-50 p-4 text-sm text-purple-800">
              <p className="font-semibold">🔒 Getting Started</p>
              <p className="mt-1">Enter your username or email and password to sign in securely.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
