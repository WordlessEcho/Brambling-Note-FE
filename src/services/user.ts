import axios from 'axios';
import { NewUser, User } from '../types';

const baseUrl = '/api/users';

const create = async (newUser: NewUser) => {
  const response = await axios.post<User>(baseUrl, newUser);
  return response.data;
};

const isVerified = async (email: string) => {
  const response = await axios.get<{ verified: boolean }>(`${baseUrl}/${email}/is-verified/`);
  return response.data.verified;
};

export default { create, isVerified };
