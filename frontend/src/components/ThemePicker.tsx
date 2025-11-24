import React from 'react';
import { getContrastColor } from '../utils/color';

const STORAGE_KEY = 'fc_accent';

function applyAccent(hex: string) {
  document.documentElement.style.setProperty('--accent', hex);
  const fg = getContrastColor(hex);
  document.documentElement.style.setProperty('--accent-foreground', fg);

  try {
    localStorage.setItem(STORAGE_KEY, hex);
  } catch {}

  window.dispatchEvent(
    new CustomEvent('fc:accent-changed', { detail: { accent: hex, foreground: fg } })
  );
}

export default function ThemePicker() {
  return (
    <input
      type="color"
      defaultValue="#6366f1"
      onChange={(e) => applyAccent(e.target.value)}
      aria-label="Pick accent color"
      className="
        w-8 h-8 cursor-pointer border rounded 
        hover:scale-110 transition-transform
      "
    />
  );
}
