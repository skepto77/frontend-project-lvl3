import i18next from 'i18next';
import setHandlers from './handlers';
import watch from './view';
import {
  getTranslatableElements,
} from './utilits';

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
      en: {
        translation: {
          feedsTitle: 'Feeds',
          postsTitle: 'Posts',
          placeholder: 'Enter rss feed url',
          submitBtn: 'Submit',
          txtExample: 'example:',
          btnDetails: 'View',
          btnClose: 'Close',
          btnReed: 'Reed the article',
          messages: {
            success: 'RSS loaded successfully',
            dublicate: 'RSS already exists',
            incorrectUrl: 'The link must be a valid URL',
            'Parse Error': 'Resource does not contain valid RSS',
            403: 'Request failed with status code 403',
            404: 'Page not found. Error 404',
            'Network Error': 'Server not found. Network error',
            'Error of update': 'Error of update',
            default: 'unknown error',
          },
        },
      },
      ru: {
        translation: {
          feedsTitle: 'Каналы',
          postsTitle: 'Сообщения',
          placeholder: 'Введите адрес rss потока',
          submitBtn: 'Отправить',
          txtExample: 'пример:',
          btnDetails: 'Просмотр',
          btnClose: 'Закрыть',
          btnReed: 'Читать статью',
          messages: {
            success: 'RSS успешно загружен',
            dublicate: 'RSS уже существует',
            incorrectUrl: 'Ссылка должна быть валидным URL',
            'Parse Error': 'Ресурс не содержит валидный RSS',
            403: 'Запрос не выполнен. Код ошибки 403',
            404: 'Стараница не найдена. Ошибка 404',
            'Network Error': 'Сервер не найден. Ошибка сети',
            'Error of update': 'Ошибка обновления',
            default: 'ошибка',
          },
        },
      },
    },
  });

  const watchedState = watch(state, getTranslatableElements(), i18nextInstance);
  setHandlers(state, i18nextInstance);
  watchedState.rssForm.status = 'init';
};
