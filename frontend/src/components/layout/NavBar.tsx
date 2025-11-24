import React from "react";
import ThemePicker from "../ThemePicker";

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
        <ThemePicker />
        {!isAuthenticated ? (
          <button
            onClick={() => onAuthOpen?.("login")}
            className="
    px-5 py-2 text-sm font-semibold rounded-full 
    bg-[color:var(--accent)]
    text-[color:var(--accent-foreground)]
    shadow-lg
    hover:shadow-[0_0_12px_var(--accent)]
    hover:brightness-110
    active:scale-95
    transition-all duration-200
  "
          >
            Login
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded border text-sm"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
