import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:8000/api/',  // URL base da API
  baseURL: 'https://www.level-backend.me/api/',  // URL base da API
  // baseURL: 'https://cors-anywhere.herokuapp.com/http://216.238.100.28:8004/api/'

});

export default instance;
