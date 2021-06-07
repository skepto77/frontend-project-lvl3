import onChange from 'on-change';
import * as y from 'yup';
import _ from 'lodash';
import {
  getTranslatableElements,
  setTranslation,
  spinner,
  feeds,
  posts,
  message,
  isPostViewed,
} from './utilits';

/* eslint no-param-reassign: 0 */
// NOTE: because of incompatability between commonjs and esm

const yup = !y.object ? y.default : y;

const schema = yup.object().shape({
  url: yup.string().required().url('incorrectUrl'),
});

const renderFeeds = (state, i18nextInstance) => {
  feeds.innerHTML = `<h2 class="feeds__title">${i18nextInstance.t('feedsTitle')}</h2><ul class="list-group mb-5">${state.rssForm.data.feeds
    .map((feed) => `<li class="list-group-item">${feed.name}</li>`)
    .join('')}</ul>`;
};

const renderPosts = (state, i18nextInstance) => {
  posts.innerHTML = `<h2 class="posts__title">${i18nextInstance.t('postsTitle')}</h2>`;
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');
  ul.innerHTML = `${state.rssForm.data.posts
    .map((item) => `<li class="list-group-item d-flex align-items-center justify-content-between"><a href="${item.link}" target="_blank" class="flex-fill ${isPostViewed(state, item.id) ? 'font-weight-normal' : 'font-weight-bold'}">${item.name}</a>
  <button type="button" class="btn btn-primary text-nowrap" data-bs-toggle="modal" data-modal="${item.id}" style="float: right">${i18nextInstance.t('btnDetails')}</button>
  </li>
  `).join('')}`;
  posts.append(ul);
};

const renderModal = (state, value, i18nextInstance) => {
  const post = _.find(state.rssForm.data.posts, { id: value });
  const div = document.createElement('div');
  div.innerHTML = `<div class="modal fade" id="${post.id}" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">${post.name}</h5>
          <button type="button" class="btn btn-light btn-close" data-bs-dismiss="modal" aria-label="Close">×</button>
        </div>
        <div class="modal-body">
          ${post.description}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary btn-close" data-bs-dismiss="modal" aria-label="Close">${i18nextInstance.t('btnClose')}</button>
          <a href="${post.link}" target="_blank" class="btn btn-primary btn-reed">${i18nextInstance.t('btnReed')}</a>
        </div>
      </div>
    </div>
  </div>`;
  document.querySelector('body').append(div);
};

const renderStatus = (status, state, elements, i18nextInstance) => {
  switch (status) {
    case 'loading':
      spinner.classList.remove('invisible');
      break;
    case 'translate':
      renderPosts(state, i18nextInstance);
      setTranslation(getTranslatableElements(), i18nextInstance);
      message.innerHTML = i18nextInstance.t(`messages.${state.rssForm.messages}`);
      break;
    case 'init':
      setTranslation(getTranslatableElements(), i18nextInstance);
      break;
    default:
      spinner.classList.add('invisible');
  }
};

const renderMessage = (value, state, elements, i18nextInstance) => {
  switch (value) {
    case 'success':
      message.innerHTML = `${i18nextInstance.t(`messages.${value}`)}`;
      elements.submitBtn.disabled = true;
      elements.input.classList.add('is-valid');
      message.classList.remove('invisible');
      message.classList.add('alert-success');
      break;
    case '':
      elements.submitBtn.disabled = false;
      message.classList.remove('alert-success', 'alert-danger', 'is-valid', 'is-invalid');
      message.classList.add('invisible');
      elements.input.classList.remove('is-valid', 'is-invalid');
      break;
    default:
      message.innerHTML = `${i18nextInstance.t(`messages.${value}`)}`;
      elements.submitBtn.disabled = true;
      elements.input.classList.add('is-invalid');
      message.classList.remove('invisible');
      message.classList.add('alert-danger');
  }
};

const watch = (state, elements, i18nextInstance) => onChange(state, (path, value) => {
  // console.log(state, path, value);
  switch (path) {
    case 'rssForm.messages':
      renderMessage(value, state, elements, i18nextInstance);
      break;
    case 'rssForm.status':
      renderStatus(value, state, elements, i18nextInstance);
      break;
    case 'rssForm.modal':
      renderPosts(state, i18nextInstance);
      renderModal(state, value, i18nextInstance);
      break;
    case 'rssForm.data.feeds':
      renderFeeds(state, i18nextInstance);
      break;
    case 'rssForm.data.posts':
      renderPosts(state, i18nextInstance);
      break;
    case 'rssForm.lang':
      i18nextInstance.changeLanguage(value).then(() => {
        renderStatus('translate', state, elements, i18nextInstance);
      });
      break;
    case 'rssForm.data.url':
      try {
        schema.validateSync(state.rssForm.data, { abortEarly: false });
        renderMessage('', state, elements, i18nextInstance);
      } catch (validationErrors) {
        state.rssForm.messages = validationErrors.message;
        renderMessage(validationErrors.message, state, elements, i18nextInstance);
      }
      break;
    default:
      throw new Error(`Unknown path: ${path}`);
  }
});

export default watch;
