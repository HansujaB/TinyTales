import client from './client';
import useAuthStore from '../store/authStore';

export const generateStory = (payload) =>
  client.post('/api/story/generate', payload);

export const extractMoral = (payload) =>
  client.post('/api/story/moral', payload);

export const continueStory = (payload) =>
  client.post('/api/story/continue', payload);

export const saveStory = (payload) =>
  client.post('/api/story/save', payload);

export const getStory = (id) =>
  client.get(`/api/story/${id}`);

export const deleteStory = (id) =>
  client.delete(`/api/story/${id}`);

export const toggleFavorite = (id) =>
  client.patch(`/api/story/${id}/favorite`);

export const streamStory = async (params, onChunk) => {
  const token = useAuthStore.getState().token;
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const res = await fetch(`${baseURL}/api/story/generate/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value);
    const lines = chunk.split('\n\n');
    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        const text = line.slice(6);
        fullText += text;
        onChunk(fullText);
      }
    }
  }
  return fullText;
};
