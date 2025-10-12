import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="text-xl">🔐</span>
            <span className="text-gray-700"> CryptoGuard AI </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-black">
              Home
            </Link>
            <Link
              href="/sign-in"
              className="rounded-lg bg-black px-4 py-2 text-white"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-500 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 text-white md:grid-cols-2">
          {/* Left side: text */}
          <div className="flex flex-col justify-center">
            <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Smart{" "}
              <span className="bg-white bg-clip-text text-transparent">
                Algorithm Identifier
              </span>
            </h1>
            <p className="mb-6 text-lg opacity-90">
              AI-powered cryptographic analysis with real-time detection, model
              training, and actionable insights.
            </p>
            <div className="flex gap-4">
              <Link
                href="/upload"
                className="rounded-xl bg-white px-6 py-3 font-semibold text-black shadow hover:bg-gray-100"
              >
                🚀 Start Analysis
              </Link>
              <button className="rounded-xl border border-white px-6 py-3 font-semibold text-white hover:bg-white hover:text-black">
                🧠 Train a Model
              </button>
            </div>
          </div>

          {/* Right side: stats card */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="grid grid-cols-2 gap-6 text-gray-900">
              <div>
                <p className="text-sm text-gray-500">Model Accuracy</p>
                <p className="text-2xl font-bold text-green-600">94.2%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Avg Response</p>
                <p className="text-2xl font-bold text-blue-600">1.2s</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Algorithms</p>
                <p className="text-2xl font-bold">12+</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Analyses</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-gray-500">
              Powered by CryptoGuard AI
            </p>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="bg-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            🔑 Key Features
          </h2>
          <p className="mt-3 text-lg text-gray-700">
            Everything you need to identify and analyze cryptographic algorithms.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-white p-8 shadow hover:shadow-lg transition">
              <div className="mb-4 text-5xl">⚡</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Real-time Detection
              </h3>
              <p className="text-gray-700">
                Instantly analyze uploaded files and detect cryptographic algorithms
                with high accuracy.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow hover:shadow-lg transition">
              <div className="mb-4 text-5xl">🧠</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Custom Training
              </h3>
              <p className="text-gray-700">
                Train models with your own datasets for tailored cryptographic
                detection.
              </p>
            </div>

            <div className="rounded-xl bg-white p-8 shadow hover:shadow-lg transition">
              <div className="mb-4 text-5xl">📊</div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                Detailed Reports
              </h3>
              <p className="text-gray-700">
                Get insights with confidence levels, accuracy metrics, and algorithm
                breakdowns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-10 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h3 className="mb-4 text-lg font-semibold">CryptoGuard AI</h3>
          <p className="mb-6 text-sm text-gray-400">
            Secure. Analyze. Detect. Powered by AI.
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white">
              Contact
            </a>
          </div>
          <p className="mt-6 text-xs text-gray-500">
            © {new Date().getFullYear()} CryptoGuard AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
