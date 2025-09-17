import React, { useMemo, useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "../Axios/axios.js";
import TokenContext from "../context/TokenContext.js";

const isValidEmail = (email = "") => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(email);

export default function Login() {
  const { userToken, tokenDispatch, userDispatch } = useContext(TokenContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const validation = useMemo(() => {
    const issues = {};
    if (!isValidEmail(formData.email)) issues.email = "Enter a valid email";
    if (!formData.password) issues.password = "Password is required";
    return issues;
  }, [formData]);

  const isFormValid = Object.keys(validation).length === 0;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");
    setSuccess("");

    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await axios.post("/user/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      tokenDispatch({ type: "SET_TOKEN", payload: res.data.token });
      userDispatch({ type: "SET_USER", payload: res.data.user });

      const storage = formData.remember ? localStorage : sessionStorage;
      storage.setItem("authToken", JSON.stringify(res.data.token));

      setSuccess("Welcome back! Redirecting…");
    } catch (err) {
      const message = err?.response?.data?.message || "Invalid credentials";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (userToken) return <Navigate to="/" />;

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-10 px-6 py-10 md:grid-cols-2 md:items-center md:py-16">
        <div className="order-2 md:order-1">
          <div className="mx-auto w-full max-w-md">
            <div className="relative rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                  Sign in
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                  Welcome back! Please enter your details.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  {success}
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
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    aria-invalid={submitted && !!validation.email}
                    aria-describedby="email-error"
                    className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
                    placeholder="you@example.com"
                  />
                  {submitted && validation.email && (
                    <p
                      id="email-error"
                      role="alert"
                      aria-live="polite"
                      className="mt-1 text-xs text-red-600"
                    >
                      {validation.email}
                    </p>
                  )}
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgotPassword"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      aria-invalid={submitted && !!validation.password}
                      aria-describedby="password-error"
                      className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pr-12 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 disabled:opacity-60"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9.27-3.11-11-8 1-2.73 2.91-4.99 5.21-6.36m3.18-1.26A11 11 0 0123 12c-.64 1.74-1.7 3.3-3.06 4.56M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="h-5 w-5"
                        >
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {submitted && validation.password && (
                    <p
                      id="password-error"
                      role="alert"
                      aria-live="polite"
                      className="mt-1 text-xs text-red-600"
                    >
                      {validation.password}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <label
                    htmlFor="remember"
                    className="flex select-none items-center gap-3 text-sm text-slate-700"
                  >
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <span
                      className="grid h-5 w-5 place-content-center rounded-md border border-slate-300 bg-white transition peer-checked:border-indigo-600 peer-checked:bg-indigo-600"
                      aria-hidden="true"
                    >
                      <svg
                        className="h-3.5 w-3.5 opacity-0 transition-opacity duration-150 peer-checked:opacity-100"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-lg shadow-indigo-600/20 outline-none transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                  )}
                  <span>{loading ? "Signing in" : "Login"}</span>
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
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Register
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="mx-auto flex w-full max-w-md flex-col items-center text-center md:items-start md:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-black/5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Secure • Fast • Minimal
            </div>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              Welcome back
            </h2>
            <p className="mt-4 max-w-md text-slate-600">
              Pick up right where you left off. Your tasks are synced and ready.
            </p>

            <div className="mt-8 grid w-full grid-cols-3 gap-3 text-xs text-slate-700">
              <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
                <p className="font-semibold">Quick access</p>
                <p className="mt-1 text-slate-500">Jump into today’s tasks.</p>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
                <p className="font-semibold">Secure auth</p>
                <p className="mt-1 text-slate-500">Your data stays safe.</p>
              </div>
              <div className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
                <p className="font-semibold">Lightweight UI</p>
                <p className="mt-1 text-slate-500">Fast and responsive.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
