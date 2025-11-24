import React from 'react';

export default function Landing() {
  return (
    <section className="min-h-[60vh] flex items-center justify-center p-8">
      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold mb-4">Master concepts with flashcards</h1>
          <p className="muted mb-6">
            Create decks, add cards, and practice with spaced repetition. Learn by building.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-64 h-40">
            <div className="absolute top-2 left-6 w-32 h-20 bg-[color:var(--surface)] border rounded-md shadow-sm card-animate" />
            <div className="absolute top-6 left-16 w-32 h-20 bg-[color:var(--surface)] border rounded-md shadow-sm card-animate delay-200" />
            <div className="absolute top-12 left-0 w-32 h-20 bg-[color:var(--surface)] border rounded-md shadow-sm card-animate delay-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
