// src/app/sign-up/page.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Check, X } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameMsg, setUsernameMsg] = useState<string | null>(null);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // debounce timer ref
  const debounceRef = useRef<number | null>(null);
  const DEBOUNCE_MS = 600;

  useEffect(() => {
    // reset messages when username cleared
    if (!username) {
      setUsernameMsg(null);
      setUsernameAvailable(null);
      setChecking(false);
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      return;
    }

    // client-side quick validation
    if (!/^[a-zA-Z0-9_]{0,20}$/.test(username)) {
      setUsernameAvailable(false);
      setUsernameMsg("Only letters, numbers, underscore (max 20)");
      return;
    }

    // clear previous timer
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    // schedule check after user stops typing
    setChecking(true);
    setUsernameMsg(null);
    debounceRef.current = window.setTimeout(() => {
      checkUsername(username);
    }, DEBOUNCE_MS);

    // cleanup on unmount
    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [username]);

  async function checkUsername(u: string) {
    try {
      setChecking(true);
      setUsernameMsg(null);
      setUsernameAvailable(null);

      const res = await fetch("/api/username/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: u }),
      });
      const data = await res.json();
      if (!res.ok) {
        // server side rejected (bad format, etc.)
        setUsernameAvailable(false);
        setUsernameMsg(data?.message || "Invalid username");
      } else {
        setUsernameAvailable(Boolean(data?.available));
        setUsernameMsg(data?.message || (data.available ? "Available" : "Taken"));
      }
    } catch (err) {
      console.error("username check error", err);
      setUsernameAvailable(false);
      setUsernameMsg("Network error");
    } finally {
      setChecking(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // final client-side checks
    if (!username || usernameAvailable === false) {
      setError("Choose an available username.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      // success -> redirect to verify
      window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
    } catch (err) {
      console.error(err);
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
        {/* Left gradient panel */}
        <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 text-white md:flex p-10 relative">
          <div className="mb-6 text-6xl">✨</div>
          <h2 className="mb-3 text-3xl font-bold">Join CryptoGuard AI</h2>
          <p className="max-w-md text-center text-lg opacity-90">
            Create your account and unlock AI-powered cryptographic analysis.
          </p>
          <div className="mt-8 flex gap-3">
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">
              🛡️ Secure
            </span>
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">
              ⚡ Fast
            </span>
            <span className="rounded-full bg-white/20 px-4 py-1 text-sm backdrop-blur">
              🔑 Easy Access
            </span>
          </div>
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2">
          <form onSubmit={onSubmit} className="w-full max-w-md rounded-xl bg-white p-8">
            <h1 className="mb-2 text-2xl font-bold text-purple-600">Create an Account</h1>
            <p className="mb-6 text-sm text-gray-600">We’ll send you an OTP to verify your email</p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Name */}
            <label className="mb-2 block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="text-black placeholder-gray-200 mb-4 w-full rounded-lg border px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />

            {/* Username */}
            <label className="mb-2 block text-sm font-medium text-gray-700">Username</label>
            <div className="relative mb-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username (letters, numbers, _ )"
                className="text-black placeholder-gray-200 w-full rounded-lg border px-4 py-3 pr-10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
              {/* small status area under input */}
            </div>

            <div className="mb-4 min-h-[1.25rem]">
              {checking ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking username...
                </div>
              ) : usernameAvailable === true ? (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="h-4 w-4" />
                  {usernameMsg ?? "Username available"}
                </div>
              ) : usernameAvailable === false ? (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <X className="h-4 w-4" />
                  {usernameMsg ?? "Username not available"}
                </div>
              ) : (
                <div className="text-sm text-gray-500">Allowed: letters, numbers, underscore; 3–20 chars</div>
              )}
            </div>

            {/* Email */}
            <label className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="text-black placeholder-gray-200 mb-4 w-full rounded-lg border px-4 py-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />

            {/* Password */}
            <label className="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a password"
                className="text-black placeholder-gray-200 w-full rounded-lg border px-4 py-3 pr-10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-xl"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading || checking || usernameAvailable === false}
              className="mb-4 w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white shadow hover:bg-purple-500 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account? <Link href="/sign-in" className="font-medium text-purple-600">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
