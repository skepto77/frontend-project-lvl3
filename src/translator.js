import _ from 'lodash';
import i18next from 'i18next';

const getElementValues = () => {
  const elements = {
    submitBtn: document.querySelector('.btn[type="submit"]'),
    input: document.querySelector('input[type=text]'),
    feedsTitle: document.querySelector('.feeds__title'),
    postsTitle: document.querySelector('.posts__title'),
    txtExample: document.querySelector('[data-i18n="content.example"]'),
    errors: document.getElementById('errors'),
    placeholder: document.querySelector('input').placeholder,
  };
  return elements;
};

const setTranslation = (elements) => {
  _.forEach(elements, (value, key) => {
    if (key === 'placeholder') {
      document.querySelector('input').placeholder = i18next.t('placeholder');
    }
    if (value && key !== 'placeholder') {
      // eslint-disable-next-line no-param-reassign
      value.innerHTML = i18next.t(key);
    }
  });
};

export { getElementValues, setTranslation };
