import React, { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

type Deck = {
  id: string;
  title: string;
  isDefault?: boolean;
  dueCount?: number;
};

const initialDecks: Deck[] = [
  { id: "react", title: "React (default)", isDefault: true, dueCount: 5 },
  { id: "node", title: "Node.js (default)", isDefault: true, dueCount: 3 },
  { id: "mongo", title: "MongoDB (default)", isDefault: true, dueCount: 2 },
];

export default function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>(initialDecks);

  function handleCreateDeck() {
    const title = prompt("New deck title");
    if (!title) return;
    const newDeck: Deck = {
      id: `${Date.now()}`,
      title,
      isDefault: false,
      dueCount: 0,
    };
    setDecks((s) => [newDeck, ...s]);
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div>
          <button
            onClick={handleCreateDeck}
            className="px-3 py-2 rounded bg-[color:var(--accent)] text-[color:var(--accent-foreground)]"
          >
            + New Deck
          </button>
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-4">
        {decks.map((d) => (
          <article
            key={d.id}
            className="p-5 bg-[color:var(--surface)] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-[color:var(--text)]">
                  {d.title}
                </h3>
                <p className="text-sm muted">
                  {d.isDefault ? "Default deck" : "Your deck"}
                </p>
              </div>
              <div className="text-sm font-medium text-[color:var(--accent)]">
                {d.dueCount ?? 0} due
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Edit deck"
                className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] focus:ring-offset-1"
              >
                <FiEdit className="w-5 h-5" />
              </button>

              <button
                type="button"
                aria-label="Delete deck"
                className="p-2 rounded-md border border-red-400 text-red-600 hover:bg-red-50 transition focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>

              <button
                type="button"
                className="ml-auto px-4 py-2 rounded-md bg-[color:var(--accent)] text-[color:var(--accent-foreground)] text-sm font-semibold hover:bg-[color:var(--accent)]/90 transition"
              >
                Study
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
