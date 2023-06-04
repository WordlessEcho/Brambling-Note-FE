import axios from 'axios';

const baseUrl = '/api/email';

const resendVerify = async (email: string) => {
  const response = await axios.get<void>(`${baseUrl}/${email}/resend/`);
  return response.data;
};

export default { resendVerify };
