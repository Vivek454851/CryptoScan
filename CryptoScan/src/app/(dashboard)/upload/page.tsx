"use client";
import { useState, useRef } from "react";

/* -----------------------------
   Types
------------------------------*/
type AnalysisResult = {
  filename: string;
  algorithm: string;
  confidence: number;
  ciphertext_preview: string;
};

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<Record<string, AnalysisResult>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(80);

  const fileRef = useRef<HTMLInputElement | null>(null);

  /* -----------------------------
     Handle file selection
  ------------------------------*/
  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
    setResults({});
  }

  /* -----------------------------
     Analyze single file
  ------------------------------*/
  async function analyzeFile(file: File) {
    try {
      setLoading(file.name);

      const form = new FormData();
      form.append("file", file);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_ML_API}/predict-file`,
        {
          method: "POST",
          body: form,
        }
      );

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      const data: AnalysisResult = await res.json();

      setResults((prev) => ({
        ...prev,
        [file.name]: data,
      }));
    } catch (err) {
      alert(`Error analyzing ${file.name}`);
    } finally {
      setLoading(null);
    }
  }

  /* -----------------------------
     Analyze all files
  ------------------------------*/
  async function analyzeAll() {
    for (const f of files) {
      await analyzeFile(f);
    }
  }

  /* -----------------------------
     UI
  ------------------------------*/
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-3xl font-bold">📤 Upload & Analyze</h1>
          <p className="text-gray-600">
            Upload encrypted files for AI-based cryptographic detection
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 md:grid-cols-2">

          {/* Upload Area */}
          <div>
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center shadow hover:border-purple-500"
              onClick={() => fileRef.current?.click()}
            >
              <div className="mb-4 text-6xl">📁</div>
              <h3 className="mb-2 text-lg font-semibold">
                Drop encrypted files here
              </h3>
              <p className="text-gray-600">
                or{" "}
                <span className="text-purple-600 underline">
                  browse to select
                </span>
              </p>

              <input
                ref={fileRef}
                type="file"
                multiple
                onChange={onFiles}
                className="hidden"
              />
            </div>

            {/* Supported formats */}
            <div className="mt-6">
              <p className="mb-2 text-sm text-gray-600">Supported formats:</p>
              <div className="flex flex-wrap gap-2">
                {[".txt", ".bin", ".enc", ".dat", ".pem"].map((ext) => (
                  <span
                    key={ext}
                    className="rounded-full bg-gray-100 px-3 py-1 text-sm"
                  >
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="rounded-2xl bg-white p-8 shadow">
            <h2 className="mb-6 text-lg font-semibold">Analysis Options</h2>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Confidence Threshold
              </label>
              <input
                type="range"
                min="50"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <span className="mt-1 block text-sm text-gray-600">
                {confidence}%
              </span>
            </div>

            <button
              onClick={analyzeAll}
              className="w-full rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              🔍 Analyze All
            </button>
          </div>
        </div>

        {/* Results */}
        {files.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 text-lg font-semibold">
              📊 Analysis Results
            </h3>

            <div className="grid gap-4">
              {files.map((file) => {
                const result = results[file.name];

                return (
                  <div
                    key={file.name}
                    className="rounded-xl border bg-white p-4 shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">
                          {Math.round(file.size / 1024)} KB
                        </p>

                        {result && (
                          <p className="mt-1 text-sm">
                            🔐 <b>{result.algorithm}</b> —{" "}
                            {(result.confidence * 100).toFixed(1)}%
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => analyzeFile(file)}
                        disabled={loading === file.name}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 disabled:opacity-50"
                      >
                        {loading === file.name ? "Analyzing..." : "Analyze"}
                      </button>
                    </div>

                    {/* Ciphertext Preview */}
                    {result && (
                      <pre className="mt-3 max-h-40 overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-800">
                        {result.ciphertext_preview}
                      </pre>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
