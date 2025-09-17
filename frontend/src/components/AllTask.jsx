import React, { useContext } from "react";
import Task from "./Task/Task";
import TaskContext from "../context/TaskContext";

function AllTask() {
  const { tasks } = useContext(TaskContext);

  return (
    <section className="px-4 py-6">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            All tasks
          </h2>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-black/5">
            {tasks.length}
          </span>
        </div>

        {tasks.length !== 0 ? (
          <ul className="space-y-4 md:space-y-5">
            {tasks.map((task, index) => (
              <li key={index}>
                <Task task={task} id={index} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
            <div className="mx-auto mb-3 grid h-12 w-12 place-content-center rounded-full bg-indigo-100 text-indigo-700">
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
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              No tasks yet
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Create your first task to get started.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default AllTask;
