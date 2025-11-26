import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiArrowLeft, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import './DeckDetail.css';

type Flashcard = {
  _id: string;
  question: string;
  answer: string;
  details?: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  userId?: string | null;
};

type Deck = {
  _id: string;
  name: string;
  description?: string;
  type: "default" | "user";
  flashcards: Flashcard[];
};

export default function DeckDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    details: '',
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    tags: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeck() {
      if (!deckId) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("fc_token");
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`/api/decks/${deckId}`, { headers });
        if (!res.ok) {
          setError("Failed to load deck");
          setLoading(false);
          return;
        }

        const data = await res.json();
        setDeck(data?.data?.deck || null);
      } catch {
        setError("Network error loading deck");
      } finally {
        setLoading(false);
      }
    }

    loadDeck();
  }, [deckId]);

  const handleCardSelect = (card: Flashcard) => {
    setSelectedCard(card);
    setShowAnswer(false);
  };

  const handleFlip = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      const token = localStorage.getItem("fc_token");
      if (!token) {
        alert('Not authenticated');
        return;
      }

      const res = await fetch(`/api/flashcards/${cardId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        alert(payload?.message || 'Failed to delete card');
        return;
      }

      if (deck) {
        const updatedDeck = {
          ...deck,
          flashcards: deck.flashcards.filter(card => card._id !== cardId)
        };
        setDeck(updatedDeck);
        
        if (selectedCard?._id === cardId) {
          setSelectedCard(null);
        }
      }
    } catch (error) {
      alert('Network error deleting card');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
      details: '',
      difficulty: 'medium',
      tags: '',
    });
    setFormError(null);
    setEditingCard(null);
  };

  const openAddCardModal = () => {
    resetForm();
    setShowAddCardModal(true);
  };

  const openEditCardModal = (card: Flashcard) => {
    setEditingCard(card);
    setFormData({
      question: card.question,
      answer: card.answer,
      details: card.details || '',
      difficulty: card.difficulty,
      tags: card.tags.join(', '),
    });
    setShowAddCardModal(true);
  };

  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.question.trim() || !formData.answer.trim()) {
      setFormError('Question and answer are required');
      return;
    }

    setFormLoading(true);

    try {
      const token = localStorage.getItem("fc_token");
      if (!token) {
        setFormError('Not authenticated');
        setFormLoading(false);
        return;
      }

      const cardData = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        details: formData.details.trim() || undefined,
        difficulty: formData.difficulty,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        deckId: deck?._id,
      };

      let res;
      if (editingCard) {
        res = await fetch(`/api/flashcards/${editingCard._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cardData),
        });
      } else {
        res = await fetch('/api/flashcards', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cardData),
        });
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setFormError(payload?.message || 'Failed to save card');
        setFormLoading(false);
        return;
      }

      const data = await res.json();
      const savedCard = data?.data?.flashcard;

      if (deck) {
        if (editingCard) {
          const updatedDeck = {
            ...deck,
            flashcards: deck.flashcards.map(card => 
              card._id === editingCard._id ? savedCard : card
            )
          };
          setDeck(updatedDeck);
          
          if (selectedCard?._id === editingCard._id) {
            setSelectedCard(savedCard);
          }
        } else {
          const updatedDeck = {
            ...deck,
            flashcards: [...deck.flashcards, savedCard]
          };
          setDeck(updatedDeck);
        }
      }

      setShowAddCardModal(false);
      resetForm();
    } catch (error) {
      setFormError('Network error');
    } finally {
      setFormLoading(false);
    }
  };

  const closeModal = () => {
    setShowAddCardModal(false);
    resetForm();
  };

  if (loading) return <div className="p-6">Loading deck...</div>;
  if (error)
    return (
      <div className="p-6">
        <div className="text-red-500 mb-4">{error}</div>
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded bg-accent text-accent-foreground"
        >
          Back to Dashboard
        </Link>
      </div>
    );

  if (!deck)
    return (
      <div className="p-6">
        Deck not found
        <Link
          to="/dashboard"
          className="ml-2 px-3 py-2 rounded bg-accent text-accent-foreground"
        >
          Back
        </Link>
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg bg-surface shadow hover:shadow-md"
          >
            <FiArrowLeft className="w-5 h-5 text-accent" />
          </Link>

          <div>
            <h1 className="text-3xl font-semibold text-text">{deck.name}</h1>

            {deck.description && (
              <p className="text-muted mt-1">{deck.description}</p>
            )}

            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="px-2 py-1 rounded bg-accent/10 text-accent">
                {deck.type === "default" ? "Default Deck" : "Your Deck"}
              </span>
              <span className="text-muted">
                {deck.flashcards?.length || 0} cards
              </span>
            </div>
          </div>
        </div>

        {deck.type === "user" && (
          <button 
            onClick={openAddCardModal}
            className="flex items-center gap-2 px-3 py-2 rounded bg-accent text-accent-foreground shadow hover:shadow-md"
          >
            <FiPlus /> Add Card
          </button>
        )}
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-6 mt-6">
        <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-2">
          <h3 className="text-lg font-semibold text-text">Flashcards</h3>

          {deck.flashcards && deck.flashcards.length > 0 ? (
            deck.flashcards.map((card) => (
              <div
                key={card._id}
                onClick={() => handleCardSelect(card)}
                className={`p-4 bg-surface rounded-lg shadow cursor-pointer transition-all 
                hover:shadow-md overflow-hidden
                ${
                  selectedCard?._id === card._id
                    ? "ring-2 ring-accent bg-accent/5"
                    : ""
                }`}
              >
                <div className="font-medium text-text">
                  {card.question.length > 60
                    ? card.question.substring(0, 60) + "..."
                    : card.question}
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span
                    className={`px-2 py-1 rounded text-white 
                    ${
                      card.difficulty === "easy"
                        ? "bg-green-500"
                        : card.difficulty === "medium"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {card.difficulty}
                  </span>

                  {card.tags.length > 0 && (
                    <span className="text-muted">
                      {card.tags.slice(0, 2).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-muted">
                there are no cards in this deck, please add
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-center">
          {selectedCard ? (
            <div className="w-full max-w-xl">
              <div
                onClick={handleFlip}
                className={`card ${showAnswer ? 'flipped' : ''}`}
              >
                <div className="card-front">
                  <div className="card-content">
                    <div className="card-label">Question</div>
                    <div className="card-text">
                      {selectedCard.question}
                    </div>
                    {selectedCard.details && (
                      <div className="card-details">
                        {selectedCard.details}
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-back">
                  <div className="card-content">
                    <div className="card-label">Answer</div>
                    <div className="card-text">
                      {selectedCard.answer}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-instructions">
                Click to {showAnswer ? "show question" : "show answer"}
              </div>
            </div>
          ) : (
            <div className="empty-card-viewer">
              <div className="empty-message">Select a flashcard</div>
            </div>
          )}
        </div>
      </div>

      {selectedCard && selectedCard.userId && (
        <div className="flex gap-3 justify-center mt-4">
          <button 
            onClick={() => openEditCardModal(selectedCard)}
            className="flex items-center gap-2 px-4 py-2 rounded border text-text hover:bg-surface shadow"
          >
            <FiEdit /> Edit
          </button>
          <button 
            onClick={() => handleDeleteCard(selectedCard._id)}
            className="flex items-center gap-2 px-4 py-2 rounded border text-red-600 hover:bg-red-50 shadow"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      )}

      {showAddCardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editingCard ? 'Edit Card' : 'Add New Card'}
            </h2>

            {formError && (
              <div className="mb-3 text-sm text-red-600 bg-red-50 p-2 rounded">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
                  className="w-full px-3 py-2 border rounded resize-none"
                  placeholder="Enter your question"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
                  className="w-full px-3 py-2 border rounded resize-none"
                  placeholder="Enter the answer"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Details (optional)
                </label>
                <textarea
                  value={formData.details}
                  onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                  className="w-full px-3 py-2 border rounded resize-none"
                  placeholder="Additional details or context"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Difficulty
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Tags (optional)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Enter tags separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Example: javascript, arrays, programming
                </p>
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-accent text-accent-foreground rounded hover:shadow-md disabled:opacity-50"
                >
                  {formLoading 
                    ? (editingCard ? 'Saving...' : 'Creating...') 
                    : (editingCard ? 'Save Changes' : 'Create Card')
                  }
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                  disabled={formLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
