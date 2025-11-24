import React from "react";
import ThemePicker from "../ThemePicker";
import "./NavBar.css";

type Props = {
  isAuthenticated?: boolean;
  onLogout?: () => void;
  onAuthOpen?: (mode: "login" | "signup") => void;
};

export default function NavBar({
  isAuthenticated,
  onLogout,
  onAuthOpen,
}: Props) {
  return (
    <nav className="w-full bg-[color:var(--surface)] shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-xl font-black tracking-wider text-[color:var(--accent)]">
          FLASHCARDS
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block text-sm muted">Learn & Review</div>
        <ThemePicker />
        {!isAuthenticated ? (
          <button
            onClick={() => onAuthOpen?.("login")}
            className="px-3 py-1 rounded text-sm nav-login-btn"
            type="button"
          >
            Login
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded text-sm nav-logout-btn"
            type="button"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
