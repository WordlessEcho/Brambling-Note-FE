import axios from 'axios';
import { NewPasswordUser, NewUser, User } from '../types';

const baseUrl = '/api/users';

const create = async (newUser: NewUser) => {
  const response = await axios.post<User>(baseUrl, newUser);
  return response.data;
};

const changePassword = async (newPasswordUser: NewPasswordUser) => {
  const response = await axios.put(`${baseUrl}/password`, newPasswordUser);
  return response.data;
};

const isVerified = async (email: string) => {
  const response = await axios.get<{ verified: boolean }>(`${baseUrl}/${email}/is-verified/`);
  return response.data.verified;
};

export default { create, changePassword, isVerified };
