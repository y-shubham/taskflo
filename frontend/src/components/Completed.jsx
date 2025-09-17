import React, { useContext } from "react";
import TaskContext from "../context/TaskContext";
import CompletedTask from "./CompletedTask";

function Completed() {
  const { tasks } = useContext(TaskContext);
  const completedCount = tasks.reduce(
    (n, t) => (t && t.completed ? n + 1 : n),
    0
  );

  return (
    <section className="px-4 py-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Completed
          </h2>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20">
            {completedCount}
          </span>
        </div>

        {tasks.length !== 0 ? (
          <ul className="space-y-4 md:space-y-5">
            {tasks.map((task, index) =>
              task.completed ? (
                <li key={index}>
                  <CompletedTask task={task} id={index} />
                </li>
              ) : null
            )}
          </ul>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-full bg-emerald-100 text-emerald-700">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              Nothing completed yet
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Mark tasks as done to see them here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Completed;
