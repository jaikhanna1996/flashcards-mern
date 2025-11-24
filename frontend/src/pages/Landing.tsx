import React from 'react';
import './Landing.css';

export default function Landing() {
  return (
    <section className="landing-hero">
      <div className="landing-container">
        <div className="landing-copy">
          <h1 className="landing-title">Master concepts with flashcards</h1>
          <p className="landing-sub">
            Create decks, add cards, and practice with spaced repetition. Learn by building.
          </p>
        </div>

        <div className="card-cluster" aria-hidden>
          <div className="card-item card-1 card-animate" />
          <div className="card-item card-2 card-animate delay-200" />
          <div className="card-item card-3 card-animate delay-400" />
        </div>
      </div>
    </section>
  );
}
