import i18next from 'i18next';
import { setLocale } from 'yup';
import app from './app';
import ru from './locales/ru';
import en from './locales/en';

export default () => {
  const state = {
    rssForm: {
      status: 'filling',
      data: {
        url: '',
        feeds: [],
        posts: [],
      },
      readedPostsId: [],
      lang: 'ru',
      modal: null,
      messages: '',
    },
  };

  const i18nextInstance = i18next.createInstance();

  i18nextInstance.init({
    lng: state.rssForm.lang,
    debug: false,
    resources: {
      ru,
      en,
    },
  })
    .then(() => {
      setLocale({
        mixed: {
          default: 'error',
        },
        string: {
          url: () => i18nextInstance.t('incorrectUrl'),
        },
      });
    })
    .then(() => app(state, i18nextInstance));
};
