import client from './client';

export const generateEmotionStory = (payload) =>
  client.post('/api/emotion/story', payload);
