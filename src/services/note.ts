import axios from 'axios';
import { NewNote, Note } from '../types';

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

const add = async (newNote: NewNote) => {
  const response = await axios.post<Note>(baseUrl, newNote, getConfig());
  return response.data;
};

const update = async (id: string, newNote: NewNote) => {
  const response = await axios.put<Note>(`${baseUrl}/${id}`, newNote, getConfig());
  return response.data;
};

const remove = (id: string) => (
  axios.delete<void>(`${baseUrl}/${id}`, getConfig())
);

export default {
  setToken,
  clearToken,
  getAll,
  add,
  update,
  remove,
};
