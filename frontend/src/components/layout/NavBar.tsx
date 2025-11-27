import React from "react";
import ThemePicker from "../ThemePicker";
import ThemeToggle from "../ThemeToggle";
import "./NavBar.css";
import { FiZap } from "react-icons/fi"; // icon for brand

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
    <nav className="
      w-full 
      bg-[color:var(--surface)] 
      shadow-md 
      px-6 py-3 
      flex items-center justify-between
      backdrop-blur-sm
    ">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <FiZap className="text-[color:var(--accent)] w-6 h-6" />

        <div className="text-2xl font-extrabold tracking-wide text-[color:var(--accent)]">
          FlashCards
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <ThemePicker />

        {!isAuthenticated ? (
          <button
            onClick={() => onAuthOpen?.("login")}
            className="nav-btn nav-login"
            type="button"
          >
            Login
          </button>
        ) : (
          <button
            onClick={onLogout}
            className="nav-btn nav-logout"
            type="button"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
