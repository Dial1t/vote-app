import { Poll } from '../types/Poll';

const API_BASE_URL = 'http://localhost:3000/api/v1';

export const PollsAPI = {
  getAll: async (): Promise<Poll[]> => {
    const response = await fetch(`${API_BASE_URL}/polls`);
    if (!response.ok) {
      throw new Error('Не вдалося завантажити голосування');
    }
    return response.json();
  },

  getById: async (id: number): Promise<Poll> => {
    const response = await fetch(`${API_BASE_URL}/polls/${id}`);
    if (!response.ok) {
      throw new Error('Не вдалося завантажити голосування');
    }
    return response.json();
  }
};