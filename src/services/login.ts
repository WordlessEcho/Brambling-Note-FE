import axios from 'axios';
import { LoginUser, User } from '../types';

const baseUrl = '/api/login';

const login = async (credentials: LoginUser) => {
  const response = await axios.post<User>(baseUrl, credentials)
  return response.data;
};

const loginService = { login };
export default loginService;
