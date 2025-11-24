import React, { useState } from 'react';

type Deck = {
  id: string;
  title: string;
  isDefault?: boolean;
  dueCount?: number;
};

const initialDecks: Deck[] = [
  { id: 'react', title: 'React (default)', isDefault: true, dueCount: 5 },
  { id: 'node', title: 'Node.js (default)', isDefault: true, dueCount: 3 },
  { id: 'mongo', title: 'MongoDB (default)', isDefault: true, dueCount: 2 },
];

export default function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>(initialDecks);

  function handleCreateDeck() {
    const title = prompt('New deck title');
    if (!title) return;
    const newDeck: Deck = { id: `${Date.now()}`, title, isDefault: false, dueCount: 0 };
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
          <article key={d.id} className="p-4 bg-[color:var(--surface)] rounded shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold">{d.title}</div>
                <div className="text-sm muted">{d.isDefault ? 'Default deck' : 'Your deck'}</div>
              </div>
              <div className="text-sm text-[color:var(--accent)]">{d.dueCount ?? 0} due</div>
            </div>

            <div className="flex gap-2">
              <button className="px-2 py-1 rounded border text-sm">Edit</button>
              <button className="px-2 py-1 rounded border text-sm">Delete</button>
              <button className="ml-auto px-2 py-1 rounded bg-[color:var(--accent)] text-[color:var(--accent-foreground)] text-sm">
                Study
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
