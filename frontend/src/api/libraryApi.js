import client from './client';

export const getLibrary = (page = 1, limit = 20) =>
  client.get('/api/library', { params: { page, limit } });

export const getFavorites = () =>
  client.get('/api/library/favorites');

export const searchStories = (params) =>
  client.get('/api/library/search', { params });
