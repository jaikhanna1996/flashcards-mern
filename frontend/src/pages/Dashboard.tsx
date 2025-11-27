import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import CreateDeckForm from "../components/dashboard/CreateDeckForm";
import './Dashboard.css';

type Deck = {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
  description?: string;
  type?: "default" | "user";
  dueCount?: number;
};

export default function Dashboard() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDeckMode, setCreateDeckMode] = useState(false);
  const [editDeck, setEditDeck] = useState<Deck | null>(null);
  const [deleteDeck, setDeleteDeck] = useState<Deck | null>(null);

  useEffect(() => {
    async function loadDecks() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("fc_token");
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch("/api/decks", { headers });
        if (!res.ok) {
          setError("Failed to load decks");
          setLoading(false);
          return;
        }

        const data = await res.json();
        let decksData = data?.data?.decks;
        setDecks(Array.isArray(decksData) ? decksData : []);
      } catch (err) {
        setError("Network error loading decks");
      } finally {
        setLoading(false);
      }
    }

    loadDecks();
  }, []);

  function handleCreateDeck() {
    setCreateDeckMode(true);
  }

  function handleDeckCreated(deckId: string) {
    setCreateDeckMode(false);
    setEditDeck(null);
    window.location.reload(); // TODO: Replace with proper navigation refresh
  }

  function handleEditDeck(deck: Deck) {
    setEditDeck(deck);
  }

  async function handleDeckUpdated(deckId: string) {
    setEditDeck(null);
    window.location.reload();
  }

  function handleDeleteDeck(deck: Deck) {
    setDeleteDeck(deck);
  }

  async function confirmDeleteDeck() {
    if (!deleteDeck) return;
    try {
      const token = localStorage.getItem("fc_token");
      const deckId = deleteDeck.id || deleteDeck._id;
      const res = await fetch(`/api/decks/${deckId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setDeleteDeck(null);
      window.location.reload();
    } catch {
      setDeleteDeck(null);
    }
  }

  const deckTitle = (d: Deck) => d.name || d.title || "Untitled";
  const deckDesc = (d: Deck) => d.description || "";
  const deckDue = (d: Deck) => d.dueCount ?? 0;

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading decks...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <div>
          <button
            onClick={handleCreateDeck}
            className="btn btn-primary"
            type="button"
          >
            + New Deck
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 p-3 rounded bg-red-50">{error}</div>
      )}

<section className="grid md:grid-cols-3 gap-4">
  {decks.map((d) => (
    <article
      key={d.id || d._id}
      className="p-4 bg-[color:var(--surface)] rounded shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-semibold">{deckTitle(d)}</div>
          <div className="text-sm muted">
            {deckDesc(d) || (d.type === "default" ? "Default deck" : "Your deck")}
          </div>
        </div>
        <div className="text-sm text-[color:var(--accent)] whitespace-nowrap">
          {deckDue(d)} due
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {d.type !== "default" && (
          <>
            <button
              className="btn btn-outline"
              type="button"
              aria-label="Edit deck"
              onClick={() => handleEditDeck(d)}
            >
              <FiEdit className="w-4 h-4" />
            </button>
            <button
              className="btn btn-outline"
              type="button"
              aria-label="Delete deck"
              onClick={() => handleDeleteDeck(d)}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </>
        )}
        <Link
          to={`/deck/${d.id || d._id}`}
          className={`btn btn-primary ${d.type === "default" ? "" : "ml-auto"}`}
        >
          Study
        </Link>
      </div>
    </article>
  ))}
</section>

      {createDeckMode && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={() => setCreateDeckMode(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-lg"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <CreateDeckForm
              onCreateDeck={handleDeckCreated}
              onCancel={() => setCreateDeckMode(false)}
            />
          </div>
        </div>
      )}

      {editDeck && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={() => setEditDeck(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-lg"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <CreateDeckForm
              initialName={deckTitle(editDeck)}
              initialDescription={deckDesc(editDeck)}
              deckId={editDeck.id || editDeck._id}
              isEdit
              onCreateDeck={handleDeckUpdated}
              onCancel={() => setEditDeck(null)}
            />
          </div>
        </div>
      )}

      {deleteDeck && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onMouseDown={() => setDeleteDeck(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-sm bg-[color:var(--surface)] rounded shadow p-6"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mb-4 text-lg font-semibold">Delete Deck</div>
            <div className="mb-6 text-sm">
              Are you sure you want to delete <span className="font-bold">{deckTitle(deleteDeck)}</span>?
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="btn btn-outline"
                type="button"
                onClick={() => setDeleteDeck(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="button"
                onClick={confirmDeleteDeck}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
