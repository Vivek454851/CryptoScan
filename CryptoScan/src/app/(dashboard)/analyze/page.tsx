// nextjs-app/src/app/analyze/page.tsx
"use client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AnalyzePage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.detail || data.error || "Prediction failed");
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setLoading(false);
      setError("Network error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-purple-600 mb-4">🔎 Cryptographic Algorithm Detection</h1>

        <form onSubmit={onSubmit}>
          <label className="text-sm font-medium">Cipher text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={8}
            className="w-full rounded-lg border px-3 py-2 mt-2"
            placeholder="Paste ciphertext here (example: 4d2f... or QWxhZGRpbjpvcGVuIHNlc2FtZQ==)"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze Cipher"}
          </button>
        </form>

        {error && <div className="mt-4 rounded bg-red-100 px-4 py-2 text-red-700">{error}</div>}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-green-50 px-4 py-3">
              <div className="text-sm text-gray-600">Predicted algorithm</div>
              <div className="text-lg font-semibold">{result.algorithm}</div>
              <div className="text-xs text-gray-500">confidence: {(result.confidence || 0).toFixed(3)}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Top candidates</div>
              <div className="mt-2 grid gap-2">
                {result.top?.map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded border px-3 py-2">
                    <div>{t.label}</div>
                    <div className="text-sm text-gray-600">{(t.prob * 100).toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
