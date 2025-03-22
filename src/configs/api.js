import axios from 'axios';
import Cookies from 'js-cookie';

export const BASE_URL = `http://localhost:8888/api/v3/`;

export const END_POINTS = {
  token: '/identity/auth/token',
  totalAccount: '/identity/accounts/total',
  totalPost: '/post/posts/total',
  getAllAccount: (param) => `/identity/accounts?${param}`,
};

export const authAPI = () =>
  axios.create({
    baseURL: BASE_URL,
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
      'Content-Type': 'application/json',
    },
  });

export default axios.create({
  baseURL: BASE_URL,
});
