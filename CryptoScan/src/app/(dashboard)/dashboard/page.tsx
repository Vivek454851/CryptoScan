export default function DashboardPage() {
  return (
    <>
      <div className="mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Total Analyses</p>
          <p className="mt-2 text-2xl font-bold">1,247</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Algorithms Detected</p>
          <p className="mt-2 text-2xl font-bold">12+</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Model Accuracy</p>
          <p className="mt-2 text-2xl font-bold text-green-600">94.2%</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow hover:shadow-lg transition">
          <p className="text-sm text-gray-500">Avg Response</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">1.2s</p>
        </div>
      </div>

      <section className="rounded-2xl border bg-white p-8 shadow">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">
          🔬 Analysis Panel
        </h2>
        <p className="mb-6 text-gray-600">
          Upload a file or use the upload page to start analysis. Results will
          appear here once the ML model is integrated.
        </p>
        <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
          ML integration coming soon…
        </div>
      </section>
    </>
  );
}
