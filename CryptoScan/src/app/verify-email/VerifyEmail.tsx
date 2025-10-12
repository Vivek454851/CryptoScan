"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Verifying...");

    const res = await fetch("/api/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    if (!res.ok) {
      setStatus(data.error || "Invalid code");
      return;
    }

    setStatus("✅ Verified! Redirecting...");
    setTimeout(() => {
      window.location.href = "/sign-in";
    }, 1500);
  }

  async function onResend() {
    setStatus("Sending OTP...");
    const res = await fetch("/api/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setStatus(res.ok ? "OTP sent!" : data.error || "Error sending OTP");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      {/* Container */}
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl">
        {/* Left Panel */}
        <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-pink-500 text-white md:flex p-10 relative">
          <div className="mb-6 text-6xl">📩</div>
          <h2 className="mb-3 text-3xl font-bold">Verify Your Email</h2>
          <p className="max-w-md text-center text-lg opacity-90">
            We’ve sent a one-time passcode (OTP) to your inbox. Enter it to
            complete your registration and unlock CryptoGuard AI.
          </p>

          {/* Floating circles background effect */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-20 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-20 right-20 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex w-full items-center justify-center bg-white p-8 md:w-1/2">
          <form
            onSubmit={onVerify}
            className="w-full max-w-md rounded-xl bg-white p-8"
          >
            <h1 className="mb-2 text-2xl font-bold text-purple-600">
              Verify your email
            </h1>
            <p className="mb-6 text-sm text-gray-600">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-black">{email}</span>
            </p>

            {status && (
              <div className="mb-4 rounded-lg bg-purple-100 px-4 py-2 text-sm text-purple-700">
                {status}
              </div>
            )}

            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="text-black placeholder-gray-200 mb-4 w-full rounded-lg border px-4 py-3 text-center text-2xl tracking-widest focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white shadow hover:bg-purple-500"
            >
              Verify
            </button>

            <button
              type="button"
              onClick={onResend}
              className="mt-3 w-full rounded-lg border px-4 py-3 hover:bg-gray-100"
            >
              Resend Code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
