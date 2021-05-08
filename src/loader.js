import axios from 'axios';
import parse from './parser';

const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?url=';

const getRss = (url) => axios.get(`${proxy}${url}`)
  .then((response) => parse(response.data, url));

export default getRss;
