import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Poll } from '../types/Poll';
import { PollsAPI } from '../services/api';
import './HomePage.css';

const HomePage: React.FC = () => {
  const [polls, setPolls] = useState<Poll[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPolls = async () => {
    try {
      setLoading(true);
      setError(null);
      const pollsData = await PollsAPI.getAll();
      setPolls(pollsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Сталася невідома помилка');
      console.error('Помилка при завантаженні голосувань:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolls();
  }, []);

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Невідома дата';
    
    try {
      return new Date(dateString).toLocaleDateString('uk-UA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Помилка форматування дати:', error);
      return 'Невідома дата';
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <div className="loading">Завантаження голосувань...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="error">
          <p>Помилка при завантаженні голосувань: {error}</p>
          <button onClick={loadPolls} className="retry-button">
            Спробувати ще раз
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      <header className="page-header">
        <h1>Доступні голосування</h1>
        <p>Оберіть голосування, щоб переглянути деталі та проголосувати</p>
      </header>

      {!polls || polls.length === 0 ? (
        <div className="no-polls">
          <p>Наразі немає доступних голосувань.</p>
        </div>
      ) : (
        <div className="polls-table-container">
          <table className="polls-table">
            <thead>
              <tr>
                <th>Назва голосування</th>
                <th>Дата створення</th>
                <th>Кількість варіантів</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll?.id || Math.random()} className="poll-row">
                  <td className="poll-title">
                    <Link 
                      to={poll?.id ? `/poll/${poll.id}` : '#'} 
                      className="poll-link"
                    >
                      {poll?.title || 'Без назви'}
                    </Link>
                  </td>
                  <td className="poll-date">
                    {formatDate(poll?.created_at)}
                  </td>
                  <td className="poll-options-count">
                    {poll?.options ? poll.options.length : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default HomePage;