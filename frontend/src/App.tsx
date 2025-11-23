import React, { useEffect, useState } from 'react';

export default function App() {
  const [status, setStatus] = useState<string>('loading');

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setStatus(`ok @ ${new Date(d.timestamp).toLocaleTimeString()}`))
      .catch(() => setStatus('failed'));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded shadow">
        <h1 className="text-xl font-semibold mb-2">Flashcards MERN (starter)</h1>
        <p>Backend status: {status}</p>
      </div>
    </div>
  );
}
