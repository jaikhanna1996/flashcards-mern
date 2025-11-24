import React from 'react';

type RoadmapItem = {
  step: number;
  title: string;
  concept: string;
  feature: string;
};

type DeckPreview = {
  name: string;
  description: string;
  topics: string[];
};

const roadmap: RoadmapItem[] = [
  { step: 1, title: 'Project Skeleton', concept: 'JSX + Components', feature: 'Landing page layout' },
  { step: 2, title: 'Props & Composition', concept: 'Reusable components', feature: 'Deck preview cards' },
  { step: 3, title: 'State Management', concept: 'useState + controlled inputs', feature: 'Login/Register forms' },
  { step: 4, title: 'Side Effects', concept: 'useEffect + fetch', feature: 'Load decks from backend' },
];

const defaultDecks: DeckPreview[] = [
  {
    name: 'React',
    description: 'Fundamentals, hooks, and performance tips.',
    topics: ['JSX', 'Hooks', 'State vs Props'],
  },
  {
    name: 'Node.js',
    description: 'Runtime architecture and async programming.',
    topics: ['Event Loop', 'npm', 'Express basics'],
  },
  {
    name: 'MongoDB',
    description: 'Document database and Mongoose modeling.',
    topics: ['Documents', 'Collections', 'Mongoose'],
  },
];

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto max-w-5xl px-6 py-12">
        <header className="mb-10 text-center">
          <p className="text-sm uppercase tracking-wide text-slate-500">Flashcards MERN</p>
          <h1 className="mt-2 text-3xl font-bold">React Learning Roadmap</h1>
          <p className="mt-4 text-base text-slate-600">
            We&apos;ll build features that mirror the concepts you want to master. Review the plan and default decks below.
          </p>
        </header>

        <div className="grid gap-10 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold">Concept Roadmap</h2>
            <p className="mt-1 text-sm text-slate-500">Each step introduces a new React concept tied to a feature.</p>
            <ol className="mt-6 space-y-4">
              {roadmap.map((item) => (
                <li key={item.step} className="rounded-xl border border-slate-100 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Step {item.step}</div>
                  <h3 className="mt-1 text-lg font-medium">{item.title}</h3>
                  <p className="text-sm text-slate-500">Concept: {item.concept}</p>
                  <p className="mt-2 text-sm">
                    <span className="font-semibold text-slate-700">Feature:</span> {item.feature}
                  </p>
                </li>
              ))}
            </ol>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            <h2 className="text-xl font-semibold">Default Decks Overview</h2>
            <p className="mt-1 text-sm text-slate-500">These are seeded in the backend to get you started.</p>
            <div className="mt-6 space-y-4">
              {defaultDecks.map((deck) => (
                <div key={deck.name} className="rounded-xl border border-slate-100 p-4">
                  <h3 className="text-lg font-medium">{deck.name}</h3>
                  <p className="text-sm text-slate-500">{deck.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {deck.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
