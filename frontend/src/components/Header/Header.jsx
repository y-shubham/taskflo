import React, { useContext, useState } from "react";
import { NavLink, Link, Outlet } from "react-router-dom";
import TokenContext from "../../context/TokenContext.js";

export default function Header() {
  const { userToken, user } = useContext(TokenContext);
  const isAuthed = Boolean(userToken);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const firstName = (user?.name || "").split(" ")[0] || "";
  const initial = (user?.name?.[0] || "U").toUpperCase();

  const logout = () => {
    try {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken");
    } finally {
      window.location.href = "/login";
    }
  };

  const btnBase =
    "px-3 py-2 text-sm font-medium rounded-lg transition duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 active:scale-[.98]";
  const btnSoft = (isActive) =>
    `${btnBase} ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-700 hover:bg-slate-100"
    }`;

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/60 ring-1 ring-black/5">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-content-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                ✓
              </span>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                TaskFlo App
              </span>
            </Link>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            {!isAuthed ? (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) => btnSoft(isActive)}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) => btnSoft(isActive)}
                >
                  Register
                </NavLink>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="hidden text-sm text-slate-600 sm:block">
                  Hi,{" "}
                  <span className="font-medium text-slate-900 capitalize">
                    {firstName}
                  </span>
                </span>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="grid h-9 w-9 place-content-center rounded-full bg-indigo-600 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 ring-1 ring-indigo-500/30 outline-none focus:ring-4 focus:ring-indigo-200"
                    aria-haspopup="menu"
                    aria-expanded={userMenuOpen}
                    aria-label="User menu"
                  >
                    {initial}
                  </button>
                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-44 overflow-hidden rounded-xl bg-white p-1 text-sm shadow-xl ring-1 ring-black/5"
                      role="menu"
                    >
                      <div className="px-3 py-2 text-slate-600">
                        <p className="truncate text-xs">Signed in as</p>
                        <p className="truncate font-medium text-slate-900">
                          {user?.name || "User"}
                        </p>
                      </div>
                      <div className="my-1 h-px bg-slate-100" />
                      <button
                        onClick={logout}
                        className="block w-full rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
                        role="menuitem"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              aria-label="Open main menu"
              aria-expanded={mobileOpen}
            >
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="md:hidden">
            <div className="mx-4 mb-4 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-black/5">
              {!isAuthed ? (
                <div className="space-y-1">
                  <NavLink
                    onClick={() => setMobileOpen(false)}
                    to="/login"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition duration-150 active:scale-[.98] ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                  <NavLink
                    onClick={() => setMobileOpen(false)}
                    to="/register"
                    className={({ isActive }) =>
                      `block rounded-lg px-3 py-2 text-sm transition duration-150 active:scale-[.98] ${
                        isActive
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-700 hover:bg-slate-100"
                      }`
                    }
                  >
                    Register
                  </NavLink>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-3 rounded-lg px-3 py-2">
                    <div className="grid h-8 w-8 place-content-center rounded-full bg-indigo-600 text-white">
                      {initial}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-900 capitalize">
                        {user?.name || "User"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        Signed in
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <Outlet />
    </>
  );
}
