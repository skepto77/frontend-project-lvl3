import i18next from 'i18next';

import setHandlers from './handlers';

export default () => {
  const state = {
    rssForm: {
      status: 'filling', // filling, loading, update, modal
      data: {
        url: '',
        feeds: [],
        posts: [],
      },
      readedPostsId: [],
      lang: 'en',
      errors: '',
    },
  };

  setHandlers(state);

  i18next
    .init({
      lng: state.rssForm.lang,
      debug: false,
      resources: {
        en: {
          translation: {
            key: 'hello world',
            feedsTitle: 'Feeds',
            postsTitle: 'Posts',
            placeholder: 'Enter rss feed url',
            submitBtn: 'Submit',
            txtExample: 'example:',
            errors: {
              dublicate: 'This feed is already loaded',
              incorrectUrl: 'Incorrect URL',
              parserError: 'The resource does not contain a valid RSS. Parsing error',
              403: 'Request failed with status code 403',
              404: 'Page not found. Error 404',
              'Network Error': 'Server not found. Network error',
              default: 'unknown error',
            },
          },
        },
        ru: {
          translation: {
            key: 'тест',
            feedsTitle: 'Каналы',
            postsTitle: 'Сообщения',
            placeholder: 'Введите адрес rss потока',
            submitBtn: 'Отправить',
            txtExample: 'пример:',
            errors: {
              dublicate: 'Этот канал уже загружен',
              incorrectUrl: 'Введен некорректный адрес страницы',
              parserError: 'Ресурс не содержит валидный RSS. Ошибка парсинга',
              403: 'Запрос не выполнен. Код ошибки 403',
              404: 'Стараница не найдена. Ошибка 404',
              'Network Error': 'Сервер не найден. Ошибка сети',
              default: 'ошибка',
            },
          },
        },
      },
    });
};
