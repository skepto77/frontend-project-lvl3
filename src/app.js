import axios from 'axios';
import i18next from 'i18next';
import _ from 'lodash';
import watch from './view';
import { getElementValues } from './translator';

const state = {
  rssForm: {
    data: {
      url: '',
      feeds: [],
      items: [],
    },
    lang: 'en',
    errors: '',
  },
}; // ?

const elements = getElementValues();

const form = document.querySelector('form');
const linksExamples = document.querySelectorAll('.rssExample>a');
const linksLanguages = document.querySelectorAll('.lang');
const spinner = document.querySelector('.spinner-border');
// const proxy = 'https://cors-anywhere.herokuapp.com/';
const proxy = 'https://api.allorigins.win/raw?url=';
// const proxy = 'https://thingproxy.freeboard.io/fetch/';

const watchedState = watch(state, getElementValues());

const feedIsLoaded = (value) => (state.rssForm.data.feeds.find((i) => i.link === value));

const parse = (data) => {
  const parser = new DOMParser();
  const rssData = parser.parseFromString(data, 'text/xml');

  console.log(rssData);
  if (rssData.querySelector('parsererror')) {
    throw new Error('parserError');
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
};

const getRss = (url) => {
  spinner.classList.remove('invisible');
  axios.get(`${proxy}${url}`)
    .then((response) => {
      parse(response.data);
      form.reset();
      elements.submitBtn.disabled = true;
      return url;
    })
    // .then(() => {
    //   setTimeout(getRss(url), 1000);
    // })
    .catch((error) => {
      console.log('dfdfd', error);
      watchedState.rssForm.errors = (error.response) ? (`${error.response.status}`) : `${error.message}`;
    })
    .finally(() => {
      state.rssForm.data.url = '';
      spinner.classList.add('invisible');
    });
};

const setEvents = () => {
  linksExamples.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.rssForm.errors = '';
      elements.input.value = e.target.href;
      console.log(feedIsLoaded(elements.input.value));
      console.log(state.rssForm.errors);
      if (feedIsLoaded(elements.input.value)) {
        watchedState.rssForm.errors = 'dublicate';
        return;
      }
      watchedState.rssForm.data.url = elements.input.value;
    });
  });

  linksLanguages.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.rssForm.lang = e.target.id;
    });
  });

  elements.input.addEventListener('input', (e) => {
    watchedState.rssForm.errors = '';
    if (feedIsLoaded(e.target.value)) {
      watchedState.rssForm.errors = 'dublicate';
      return;
    }
    watchedState.rssForm.data.url = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    getRss(state.rssForm.data.url);
    state.rssForm.errors = '';
  });
};

export default () => {
  i18next.init({
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
            parserError: ' There is no rss feed for this url. Parsing error',
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
            parserError: 'По этому удресу нет rss ленты. Ошибка парсинга',
            403: 'Запрос не выполнен. Код ошибки 403',
            404: 'Стараница не найдена. Ошибка 404',
            'Network Error': 'Сервер не найден. Ошибка сети',
            default: 'ошибка',
          },
        },
      },
    },
  })
    .then(setEvents())
    .catch((error) => {
      console.log(error);
    });
};
