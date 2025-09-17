import React, { useContext, useEffect, useState } from "react";
import TaskContext from "../../context/TaskContext";
import TokenContext from "../../context/TokenContext";
import axios from "../../Axios/axios.js";

export default function CreateTask() {
  const { dispatch } = useContext(TaskContext);
  const { userToken } = useContext(TokenContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const isValid = {
    title: title.trim().length > 0,
    description: description.trim().length > 0,
  };
  const isFormValid = isValid.title && isValid.description;

  const handleAdd = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!isFormValid) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "/task/addTask",
        { title: title.trim(), description: description.trim() },
        {
          headers: userToken ? { Authorization: `Bearer ${userToken}` } : {},
        }
      );

      dispatch({ type: "ADD_TASK", title, description });

      setTitle("");
      setDescription("");
      setSubmitted(false);

      setToast({ type: "success", message: res?.data?.message || "Task added" });
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to add task";
      setError(message);
      setToast({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(id);
  }, [toast]);

  return (
    <section className="px-4 py-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="relative rounded-3xl bg-white p-6 shadow-xl ring-1 ring-black/5">
          <div className="mb-5">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">Create a task</h2>
            <p className="mt-1 text-sm text-slate-600">Add a clear title and a short description.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <form noValidate onSubmit={handleAdd} className="space-y-4">
            <div>
              <label htmlFor="title" className="mb-1 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={submitted && !isValid.title}
                aria-describedby="title-error"
                className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="e.g. Plan sprint backlog"
              />
              {submitted && !isValid.title && (
                <p id="title-error" className="mt-1 text-xs text-red-600">
                  Please enter a title
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                aria-invalid={submitted && !isValid.description}
                aria-describedby="description-error"
                className="block w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                placeholder="Short details that help you or your team take action"
              />
              {submitted && !isValid.description && (
                <p id="description-error" className="mt-1 text-xs text-red-600">
                  Please add a description
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setSubmitted(false);
                }}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-600/20 outline-none transition hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                )}
                <span>{loading ? "Adding" : "Add task"}</span>
                <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </form>

          {toast && (
            <div
              role="status"
              aria-live="polite"
              className={`pointer-events-auto fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl p-3 px-4 text-sm shadow-xl ring-1 ring-black/5 ${
                toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
              }`}
            >
              {toast.message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}