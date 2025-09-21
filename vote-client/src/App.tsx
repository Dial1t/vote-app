import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { api } from './api';
import { cable } from './cable';
import { Poll, Vote } from './types';
import HomePage from './pages/HomePage'; // Додано імпорт HomePage
import './App.css'; // Додано імпорт стилів

// Перейменовано функцію, щоб уникнути конфлікту імен
function PollApp() {
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    api.get<Poll>('/polls/1').then((res) => setPoll(res.data));
  }, []);

  useEffect(() => {
    if (!poll) return;

    const subscription = cable.subscriptions.create(
      { channel: 'PollChannel', poll_id: poll.id },
      {
        received: (data: Vote) => {
          setPoll((prev) => {
            if (!prev) return prev;
            return { ...prev, votes: [...prev.votes, data] };
          });
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [poll?.id]);

  const handleVote = (option: string) => {
    api.post('/votes', {
      vote: { poll_id: poll?.id, option },
    });
  };

  const getCount = (option: string) =>
    poll?.votes.filter((v) => v.option === option).length ?? 0;

  if (!poll) return <p>Loading...</p>;

  const uniqueOptions = Array.from(new Set(poll.votes.map((v) => v.option)));

  return (
    <div>
      <h1>{poll.title}</h1>
      <div style={{ display: 'flex', gap: '1rem' }}>
        {uniqueOptions.map((option) => (
          <button key={option} onClick={() => handleVote(option)}>
            {option} ({getCount(option)})
          </button>
        ))}
      </div>
    </div>
  );
}

// Нова функція App з роутингом
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/poll/:id" element={<PollApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;