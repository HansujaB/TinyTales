import client from './client';

export const generateQuiz = (payload) =>
  client.post('/api/quiz/generate', payload);
