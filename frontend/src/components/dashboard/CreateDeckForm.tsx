import React, { useState, FormEvent } from 'react';

type Props = {
  onCreateDeck?: (deckId: string) => void;
  onCancel?: () => void;
  initialName?: string;
  initialDescription?: string;
  deckId?: string;
  isEdit?: boolean;
};

export default function CreateDeckForm({
  onCreateDeck,
  onCancel,
  initialName = '',
  initialDescription = '',
  deckId,
  isEdit = false,
}: Props) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Deck name is required.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('fc_token');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      let res;
      if (isEdit && deckId) {
        res = await fetch(`/api/decks/${deckId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
          }),
        });
      } else {
        res = await fetch('/api/decks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim(),
            type: 'user',
          }),
        });
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        setError(payload?.message || 'Failed to save deck');
        setLoading(false);
        return;
      }

      const data = await res.json();
      onCreateDeck?.(data?.id || data?._id || '');
      setName('');
      setDescription('');
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md p-6 bg-[color:var(--surface)] rounded shadow">
      <h2 className="text-lg font-semibold mb-4">{isEdit ? 'Edit Deck' : 'Create Deck'}</h2>

      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

      <label className="block mb-3">
        <div className="text-sm muted mb-1">Deck Name</div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="e.g., Advanced React"
          required
        />
      </label>

      <label className="block mb-4">
        <div className="text-sm muted mb-1">Description (optional)</div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="What will you learn?"
          rows={3}
        />
      </label>

      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? 'Save' : 'Create Deck')}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1 rounded border text-sm"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
