import axios from 'axios';
import { Note } from '../types';

const baseUrl = '/api/notes';
let token: string | null = null;
type Config = { headers: { Authorization: string } };

const setToken = (newToken: string) => {
  token = `bearer ${newToken}`;
};

const clearToken = () => {
  token = null;
};

const getConfig = (): Config => {
  if (token === null) {
    throw new TypeError('Token should not be null');
  }

  return { headers: { Authorization: token } };
};

const getAll = async () => {
  const response = await axios.get<Note[]>(baseUrl, getConfig());
  return response.data;
};

export default { setToken, clearToken, getAll };
