import axios from 'axios';
import parse from './parser';

const proxy = 'https://hexlet-allorigins.herokuapp.com/raw?url=';
const getRss = (url) => axios.get(`${proxy}${url}`)
  .then((response) => parse(response.data, url))
  .catch((err) => {
    console.log(err instanceof TypeError);
    if (err instanceof TypeError) {
      throw new Error('Parse Error');
    } else {
      throw new Error('Network Error');
    }
    // // throw new NetworkError('Network Error');
  });

export default getRss;
