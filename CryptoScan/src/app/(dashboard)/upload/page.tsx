"use client";
import { useState, useRef } from "react";

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [confidence, setConfidence] = useState(80);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  }

  async function analyzeFile(file: File) {
    // Placeholder: send to /api/model when ML model is integrated
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/model", { method: "POST", body: form });
    const data = await res.json();
    alert(`Result for ${file.name}: ${JSON.stringify(data)}`);
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-3xl font-bold">📤 Upload & Analyze</h1>
          <p className="text-gray-600">
            Upload your cryptographic files for AI-powered analysis
          </p>
        </div>

        {/* Main grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload area */}
          <div>
            <div
              className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center shadow hover:border-purple-500"
              onClick={() => fileRef.current?.click()}
            >
              <div className="mb-4 text-6xl">📁</div>
              <h3 className="mb-2 text-lg font-semibold">Drop your files here</h3>
              <p className="text-gray-600">
                or{" "}
                <span className="cursor-pointer text-purple-600 underline">
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
                {[".txt", ".csv", ".json", ".pem", ".key", ".dat"].map(
                  (ext) => (
                    <span
                      key={ext}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600"
                    >
                      {ext}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Analysis options */}
          <div className="rounded-2xl bg-white p-8 shadow">
            <h2 className="mb-6 text-lg font-semibold">Analysis Options</h2>

            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium">
                Analysis Type
              </label>
              <select className="w-full rounded-lg border px-3 py-2">
                <option value="auto">Auto-detect</option>
                <option value="symmetric">Symmetric Encryption</option>
                <option value="asymmetric">Asymmetric Encryption</option>
              </select>
            </div>

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
              onClick={() => files.forEach((f) => analyzeFile(f))}
              className="w-full rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
            >
              🔍 Analyze All
            </button>
          </div>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-12">
            <h3 className="mb-4 text-lg font-semibold">📋 Uploaded Files</h3>
            <div className="grid gap-4">
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border bg-white p-4 shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">📄</div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round(file.size / 1024)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => analyzeFile(file)}
                    className="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500"
                  >
                    Analyze
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
