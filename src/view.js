/* eslint-disable max-len */

import onChange from 'on-change';
import * as y from 'yup';
import i18next from 'i18next';
// import _ from 'lodash';
import {
  getTranslatableElements,
  setTranslation,
  spinner,
  feeds,
  posts,
  errors,
} from './utilits';

/* eslint no-param-reassign: 0 */
// NOTE: because of incompatability between commonjs and esm

const yup = !y.object ? y.default : y;

const schema = yup.object().shape({
  url: yup.string().required().url('incorrectUrl'),
});

const renderFeeds = (state) => {
  feeds.innerHTML = `<h2 class="feeds__title">${i18next.t('feedsTitle')}</h2><ul class="list-group mb-5">${state.rssForm.data.feeds
    .map((feed) => `<li class="list-group-item">${feed.name}</li>`)
    .join('')}</ul>`;
};

const renderPosts = (state) => {
  posts.innerHTML = '';
  const div = document.createElement('div');
  div.innerHTML = `<h2 class="posts__title">${i18next.t('postsTitle')}</h2><ul class="list-group mb-5">${state.rssForm.data.posts
    .map((item) => `<li class="list-group-item d-flex align-items-center justify-content-between"><a href ="#" class="flex-fill">${item.name}</a></li>`).join('')}</ul>`;
  posts.append(div);
};

const watch = (state, elements) => onChange(state, (path, value) => {
  switch (path) {
    case 'rssForm.errors':
      if (value !== '') {
        errors.innerHTML = `${i18next.t(`errors.${value}`)}`;
        elements.submitBtn.disabled = true;
        errors.classList.remove('invisible');
        elements.input.classList.add('is-invalid');
        return;
      }
      elements.submitBtn.disabled = false;
      errors.classList.add('invisible');
      elements.input.classList.remove('is-invalid');
      break;
    case 'rssForm.status':
      if (value === 'loading') {
        spinner.classList.remove('invisible');
        return;
      }
      spinner.classList.add('invisible');
      break;
    case 'rssForm.data.feeds':
      renderFeeds(state, elements);
      break;
    case 'rssForm.data.posts':
      renderPosts(state, elements);
      break;

    case 'rssForm.lang':
      i18next.changeLanguage(value).then(() => {
        setTranslation(getTranslatableElements());
        document.getElementById('errors').innerHTML = i18next.t(`errors.${state.rssForm.errors}`);
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
        state.rssForm.errors = validationErrors.message;
        elements.submitBtn.disabled = true;
        errors.innerHTML = i18next.t(`errors.${validationErrors.message}`);
        errors.classList.remove('invisible').add('visible');
      }
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
});

export default watch;
