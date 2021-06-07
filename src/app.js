import getRss from './loader';
import watch from './view';
import validate from './validate';
import {
  getTranslatableElements,
  btnExamplesLinks,
  btnLanguages,
  form,
} from './utilits';

export default (state, i18nextInstance) => {
  const watchedState = watch(state, getTranslatableElements(), i18nextInstance);
  watchedState.rssForm.status = 'init';

  const timeout = 11000;
  const elements = getTranslatableElements();

  const checkUpdates = (feed) => {
    const { link, lastUpdate } = feed;
    getRss(link)
      .then((data) => {
        const newPosts = [...data.posts].filter((item) => item.pubDate > lastUpdate);
        watchedState.rssForm.data.posts = [...newPosts, ...state.rssForm.data.posts];
        setTimeout(() => checkUpdates(feed), timeout);
      })
      .catch(() => {
        watchedState.rssForm.messages = 'Error of update';
        setTimeout(() => checkUpdates(feed), timeout);
      });
  };

  const feedIsLoaded = (value) => state.rssForm.data.feeds.find((i) => i.link === value);

  const checkUrl = (url) => {
    watchedState.rssForm.messages = '';
    if (feedIsLoaded(url)) {
      watchedState.rssForm.messages = 'dublicate';
      state.rssForm.data.url = '';
      return;
    }
    state.rssForm.data.url = url;
    const error = validate({ url });
    watchedState.rssForm.messages = (!error) ? 'approved' : error;
  };

  elements.input.addEventListener('input', (e) => {
    checkUrl(e.target.value);
  });

  btnExamplesLinks.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      elements.input.value = e.target.href;
      checkUrl(elements.input.value);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.rssForm.status = 'loading';
    watchedState.rssForm.messages = '';
    const error = validate({ url: state.rssForm.data.url });
    if (!error) {
      getRss(state.rssForm.data.url)
        .then((data) => {
          watchedState.rssForm.data.feeds = [...state.rssForm.data.feeds, data.feeds];
          watchedState.rssForm.data.posts = [...data.posts, ...state.rssForm.data.posts];
          watchedState.rssForm.messages = 'success';
          return data.feeds;
        })
        .then((feed) => {
          setTimeout(checkUpdates(feed), timeout);
        })
        .catch((err) => {
          watchedState.rssForm.messages = (!error) ? `${err.message}` : error;
        })
        .finally(() => {
          watchedState.rssForm.status = 'filling';
        });
    }
    e.target.reset();
  });

  btnLanguages.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.rssForm.lang = e.target.id;
    });
  });

  document.addEventListener('DOMNodeInserted', () => {
    const btnDetails = document.querySelectorAll('#posts li>.btn');
    btnDetails.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        state.rssForm.readedPostsId = [...state.rssForm.readedPostsId, e.target.getAttribute('data-modal')];
        watchedState.rssForm.modal = e.target.getAttribute('data-modal');
        const modal = document.getElementById(e.target.getAttribute('data-modal'));
        modal.classList.add('show');
        const close = modal.querySelectorAll('[data-bs-dismiss]');
        close.forEach((btn1) => {
          btn1.addEventListener('click', () => {
            modal.classList.remove('show');
          });
        });
        modal.addEventListener('click', (event) => {
          event.preventDefault();
          if (event.target !== modal) return;
          modal.classList.remove('show');
        });
      });
    });
  });
};
