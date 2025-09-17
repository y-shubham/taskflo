import React from "react";
import moment from "moment";

function CompletedTask({ task }) {
  const when = task?.createdAt ? moment(task.createdAt).fromNow() : "just now";

  return (
    <article
      className={[
        "group relative flex items-start gap-4 rounded-2xl bg-white",
        "p-5 md:p-6 ring-1 ring-black/5 shadow-sm transition",
        "hover:-translate-y-0.5 hover:shadow-md",
        "mb-4 last:mb-0 md:mb-5",
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className="grid h-6 w-6 place-content-center rounded-md border border-emerald-600 bg-emerald-600 text-white shadow-sm"
      >
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>

      <div className="min-w-0">
        <h4 className="mb-0.5 break-words text-base md:text-lg font-semibold line-through text-slate-500">
          {task?.title}
        </h4>

        {task?.description ? (
          <p className="break-words text-sm line-through text-slate-400">
            {task.description}
          </p>
        ) : null}

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          <span>{when}</span>

          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-700 ring-1 ring-emerald-600/20">
            Completed
          </span>
        </div>
      </div>
    </article>
  );
}

export default CompletedTask;
