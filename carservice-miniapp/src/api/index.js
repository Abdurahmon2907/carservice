import client from './client';

export const getCategories = () =>
  client.get('/categories').then((r) => r.data.data);

export const getBusinessesNearby = (lat, lng, categoryId, radius = 10) =>
  client
    .get('/businesses/nearby', { params: { lat, lng, categoryId, radius } })
    .then((r) => r.data.data);

export const getBusinessById = (id) =>
  client.get(`/businesses/${id}`).then((r) => r.data.data);

export const createBooking = (data) =>
  client.post('/bookings', data).then((r) => r.data.data);

export const getMyBookings = () =>
  client.get('/bookings/my').then((r) => r.data.data);

export const loginUser = (data) =>
  client.post('/auth/login', data).then((r) => r.data);

export const registerUser = (data) =>
  client.post('/auth/register', data).then((r) => r.data);

export const telegramAuth = (initData) =>
  client.post('/auth/telegram', { initData }).then((r) => r.data);