// nextjs-app/src/app/api/predict/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

    const mlUrl = process.env.ML_API_URL || "http://127.0.0.1:8000";
    const res = await fetch(`${mlUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Next API predict error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
