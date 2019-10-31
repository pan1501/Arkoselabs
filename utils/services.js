import users from './users.json';
import animals from './animals.json';

export const fetchUsers = () =>
  new Promise(resolve => setTimeout(() => resolve(users), 20));

export const fetchAnimalById = id =>
  new Promise(resolve =>
    setTimeout(() => resolve(animals.find(({ id: idx }) => id === idx)), 10),
  );

export const fetchStatus = () =>
  new Promise(resolve => setTimeout(() => resolve({ ok: true }), 5));
