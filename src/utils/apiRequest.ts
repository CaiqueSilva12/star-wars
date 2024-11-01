import axios from 'axios';
// import dotenv from 'dotenv';

// dotenv.config();

export const axiosInstance = axios.create({
  baseURL: 'https://swapi.dev/api',
});
