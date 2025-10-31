// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Make sure this matches your server
});

export default api;