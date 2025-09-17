import React from "react";
import { NavLink } from "react-router-dom";

function TaskIndicator() {
  const base =
    "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200";
  const off = "text-slate-700 hover:bg-slate-100";
  const on = "bg-indigo-600 text-white shadow";

  return (
    <section className="px-4 pt-3">
      <div className="mx-auto w-full max-w-2xl">
        <nav
          aria-label="Task filters"
          className="rounded-2xl bg-white p-1 shadow-sm ring-1 ring-black/5"
        >
          <ul className="grid grid-cols-3 gap-1">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  [base, isActive ? on : off].join(" ")
                }
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <circle cx="3" cy="6" r="1" />
                  <circle cx="3" cy="12" r="1" />
                  <circle cx="3" cy="18" r="1" />
                </svg>
                <span>All Task</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/active"
                className={({ isActive }) =>
                  [base, isActive ? on : off].join(" ")
                }
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Active</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/completed"
                className={({ isActive }) =>
                  [base, isActive ? on : off].join(" ")
                }
              >
                <svg
                  className="h-4 w-4"
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
                <span>Completed</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </section>
  );
}

export default TaskIndicator;
