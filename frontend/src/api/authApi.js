import client from './client';

export const verifyUser = () =>
  client.post('/api/auth/verify');

export const getCurrentUser = () =>
  client.get('/api/auth/me');

export const updatePreferences = (updates) =>
  client.patch('/api/auth/preferences', updates);
