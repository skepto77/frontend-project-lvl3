/* eslint-disable max-len */

import onChange from 'on-change';
import * as y from 'yup';
import i18next from 'i18next';
// import _ from 'lodash';
import { getElementValues, setTranslation } from './translator';
/* eslint no-param-reassign: 0 */
// NOTE: because of incompatability between commonjs and esm

const yup = !y.object ? y.default : y;

const schema = yup.object().shape({
  url: yup.string().required().url(),
});

const feedsResult = document.querySelector('#feeds');
const itemsResult = document.querySelector('#items');
const errors = document.getElementById('errors');

const watch = (state, elements) => onChange(state, (path, value) => {
  console.log(state, path, value);
  switch (path) {
    case 'rssForm.errors':
      console.log(state.rssForm);
      errors.innerHTML = value;
      errors.classList.remove('invisible');
      state.rssForm.errors = [];
      elements.input.classList.add('is-invalid');
      break;
    case 'rssForm.data.feeds':
      console.log(state.rssForm.data.url);
      feedsResult.innerHTML = `<h2 class="feeds__title">${i18next.t('feedsTitle')}</h2><ul class="list-group mb-5">${state.rssForm.data.feeds.map((feed) => `<li class="list-group-item">${feed.name}</li>`).join('')}</ul>`;
      itemsResult.innerHTML = `<h2 class="posts__title">${i18next.t('postsTitle')}</h2><ul class="list-group mb-5">${state.rssForm.data.items.map((item) => `<li class="list-group-item"><a href="${item.link}">${item.name}</a></li>`).join('')}</ul>`;
      break;
    case 'rssForm.lang':
      i18next.changeLanguage(value)
        .then(() => {
          setTranslation(getElementValues());
        });
      break;
    case 'rssForm.data.url':
      try {
        schema.validateSync(state.rssForm.data, { abortEarly: false });
        elements.input.classList.remove('is-invalid');
        elements.submitBtn.disabled = false;
        errors.innerHTML = '';
        errors.classList.add('invisible');
      } catch (validationErrors) {
        errors.innerHTML = validationErrors.inner.join('<br>');
        errors.classList.remove('invisible').add('visible');
        elements.submitBtn.disabled = true;
      }
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
});

export default watch;
