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
    errors: [],
  },
}; // ?

const elements = getElementValues();

const form = document.querySelector('form');
const linksExamples = document.querySelectorAll('.rssExample>a');
const linksLanguages = document.querySelectorAll('.lang');
const spinner = document.querySelector('.spinner-border');
// const proxy = 'https://cors-anywhere.herokuapp.com/';
const proxy = 'https://api.allorigins.win/raw?url=';

const watchedState = watch(state, getElementValues());

const parse = (data) => {
  const parser = new DOMParser();
  const rssData = parser.parseFromString(data, 'text/xml');
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
      watchedState.rssForm.errors = error;
    })
    .finally(() => {
      spinner.classList.add('invisible');
    });
};

const setEvents = () => {
  linksExamples.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      elements.input.value = e.target.href;
      if (state.rssForm.data.feeds.filter((item) => item.link === e.target.href).length > 0) {
        watchedState.rssForm.errors = `${i18next.t('errors.dublicate')}`;
        return;
      }
      watchedState.rssForm.data.url = e.target.href;
    });
  });

  linksLanguages.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.rssForm.lang = e.target.id;
    });
  });

  elements.input.addEventListener('input', (e) => {
    // eslint-disable-next-line max-len
    if (state.rssForm.data.feeds.filter((item) => item.link === e.target.value).length > 0) {
      watchedState.rssForm.errors = `${i18next.t('errors.dublicate')}`;
      return;
    }
    watchedState.rssForm.data.url = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    getRss(state.rssForm.data.url);
  });
};

export default () => {
  i18next.init({
    lng: state.rssForm.lang,
    debug: true,
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
          },
        },
      },
    },
  })
    .then(setEvents());
};
