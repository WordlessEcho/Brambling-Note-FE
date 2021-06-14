import axios from 'axios';
import { NewUser, User } from '../types';

const baseUrl = '/api/users';

const create = async (newUser: NewUser) => {
  const response = await axios.post<User>(baseUrl, newUser);
  return response.data;
};

export default { create };
