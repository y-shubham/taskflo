import React, { useState } from "react";
import axios from "../../Axios/axios.js";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setMessage("");
      setError("");
      const res = await axios.post("/forgotPassword/forgotPassword", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 px-6 py-10 md:place-items-center md:py-16">
        <div className="mx-auto w-full max-w-md">
          <div className="relative rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Forgot your password?
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Enter your email and we’ll send you a reset link.
              </p>
            </div>

            {message && (
              <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form noValidate onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
                  placeholder="you@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-600/20 outline-none transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading && (
                  <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                )}
                <span>{isLoading ? "Sending" : "Send reset link"}</span>
                <svg
                  className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>

              <p className="text-center text-xs text-slate-500">
                If your email is registered, you’ll receive a reset link
                shortly.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
