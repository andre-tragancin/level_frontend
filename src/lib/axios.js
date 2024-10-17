import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://216.238.100.28:8004/api/',  // URL base da API

});

export default instance;
