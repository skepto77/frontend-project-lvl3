/* eslint-disable max-len */
import * as y from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';

// NOTE: because of incompatability between commonjs and esm
const yup = !y.object ? y.default : y;

const schema = yup.object().shape({
  url: yup.string().required().url(),
});

export default () => {
  const state = {
    rssForm: {
      data: {
        url: '',
        feeds: [],
        items: [],
      },
      errors: [],
    },
  };
  const form = document.querySelector('form');
  const source = document.querySelector('#rssSource');
  const example = document.querySelector('#rssExample>a');
  const example2 = document.querySelector('#rssExample2>a');
  // const example3 = document.querySelector('#rssExample3');
  const button = document.querySelector('.btn');
  const feeds = document.querySelector('#feeds');
  const itemsResult = document.querySelector('#items');
  const proxy = 'https://cors-anywhere.herokuapp.com';
  const input = document.querySelector('input[type=text]');
  const spinner = document.querySelector('.spinner-border');

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'rssForm.errors':
        document.getElementById('errors').innerHTML = value;
        document.getElementById('errors').classList.remove('invisible');
        break;
      case 'rssForm.data.feeds':
        console.log(state.rssForm.data.url);
        feeds.innerHTML = `<h2>Feeds</h2><ul class="list-group mb-5">${state.rssForm.data.feeds.map((feed) => `<li class="list-group-item">${feed.name}</li>`).join('')}</ul>`;
        itemsResult.innerHTML = `<h2>Posts</h2><ul class="list-group mb-5">${state.rssForm.data.items.map((item) => `<li class="list-group-item"><a href="${item.link}">${item.name}</a></li>`).join('')}</ul>`;
        spinner.classList.add('invisible');
        break;
      case 'rssForm.data.url':
        try {
          schema.validateSync(state.rssForm.data, { abortEarly: false });
          button.disabled = false;
          document.getElementById('errors').innerHTML = '';
          document.getElementById('errors').classList.add('invisible');
        } catch (validationErrors) {
          document.getElementById('errors').innerHTML = validationErrors.inner.join('<br>');
          document.getElementById('errors').classList.remove('invisible').add('visible');
          button.disabled = true;
        }
        break;
      default:
        throw new Error(`Unknown path: ${path}`);
    }
  });

  source.addEventListener('input', (e) => {
    watchedState.rssForm.data.url = e.target.value;
  });

  example.addEventListener('click', (e) => {
    e.preventDefault();
    source.value = e.target.href;
    watchedState.rssForm.data.url = e.target.href;
  });

  example2.addEventListener('click', (e) => {
    e.preventDefault();
    source.value = e.target.href;
    watchedState.rssForm.data.url = e.target.href;
  });

  // example3.addEventListener('change', (e) => {
  //   e.preventDefault();
  //   source.value = e.target.value;
  //   watchedState.rssForm.data.url = e.target.value;
  // });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    spinner.classList.remove('invisible');
    axios.get(`${proxy}/${state.rssForm.data.url}`)
      .then((response) => {
        const parser = new DOMParser();
        const rssData = parser.parseFromString(response.data, 'text/xml');
        if (state.rssForm.data.feeds.filter((item) => item.link === state.rssForm.data.url).length > 0) {
          watchedState.rssForm.errors = 'Duplicate';
          return;
        }
        const id = _.uniqueId();
        const title = rssData.querySelector('title').textContent;
        const items = rssData.querySelectorAll('item');
        const posts = [...items].map((item) => {
          const name = item.querySelector('title').textContent;
          const link = item.querySelector('link').textContent;
          return { name, link, idFeed: id };
        });
        state.rssForm.data.items = [...state.rssForm.data.items, ...posts];
        watchedState.rssForm.data.feeds.push({ id, name: title, link: state.rssForm.data.url });
        input.value = '';
        state.rssForm.data.url = '';
        button.disabled = true;
      })
      .catch((error) => {
        watchedState.rssForm.errors = error;
      })
      .finally(() => {
        spinner.classList.add('invisible');
      });
  });
};
