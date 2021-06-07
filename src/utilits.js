import _ from 'lodash';

const getTranslatableElements = () => {
  const elements = {
    submitBtn: document.querySelector('.btn[type="submit"]'),
    input: document.querySelector('input[type=text]'),
    feedsTitle: document.querySelector('.feeds__title'),
    postsTitle: document.querySelector('.posts__title'),
    btnDetails: document.querySelectorAll('#posts li>.btn'),
    btnClose: document.querySelectorAll('[data-bs-dismiss=modal]'),
    btnReed: document.querySelectorAll('.btn-reed'),
    txtExample: document.querySelector('[data-i18n="content.example"]'),
    message: document.getElementById('message'),
    placeholder: document.querySelector('input').placeholder,
  };
  return elements;
};

const setTranslation = (elements, i18nextInstance) => {
  _.forEach(elements, (value, key) => {
    if (key === 'placeholder') {
      document.querySelector('input').placeholder = i18nextInstance.t('placeholder');
    } else if (value && key !== 'placeholder') {
      // eslint-disable-next-line no-param-reassign
      value.textContent = i18nextInstance.t(key);
    }
  });
};

export const spinner = document.querySelector('.spinner-border');
export const feeds = document.querySelector('#feeds');
export const posts = document.querySelector('#posts');
export const message = document.getElementById('message');
export const form = document.querySelector('form');
export const btnExamplesLinks = document.querySelectorAll('.rssExample');
export const btnLanguages = document.querySelectorAll('.lang');

export const isPostViewed = (state, id) => state.rssForm.readedPostsId.includes(id);

export { getTranslatableElements, setTranslation };
