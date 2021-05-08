import getRss from './loader';
import watch from './view';
import {
  getTranslatableElements,
  btnExamplesLinks,
  btnLanguages,
  form,
} from './utilits';

const setHandlers = (state) => {
  const watchedState = watch(state, getTranslatableElements());
  const feedIsLoaded = (value) => state.rssForm.data.feeds.find((i) => i.link === value);
  const timeout = 111000;

  const elements = getTranslatableElements();

  const checkUpdates = (feed) => {
    // console.log('upd');
    const { link, lastUpdate } = feed;
    getRss(link)
      .then((data) => {
        const newPosts = [...data.posts].filter((item) => item.pubDate > lastUpdate);
        watchedState.rssForm.data.posts = [...newPosts, ...state.rssForm.data.posts];
        setTimeout(() => checkUpdates(feed), timeout);
      })
      .catch((error) => {
        console.log(error);
        watchedState.rssForm.errors = 'Error of update';
        setTimeout(() => checkUpdates(feed), timeout);
      });
  };

  btnExamplesLinks.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.rssForm.errors = '';
      elements.input.value = e.target.href;
      if (feedIsLoaded(elements.input.value)) {
        watchedState.rssForm.errors = 'dublicate';
        return;
      }
      watchedState.rssForm.data.url = elements.input.value;
    });
  });

  btnLanguages.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      watchedState.rssForm.lang = e.target.id;
    });
  });

  elements.input.addEventListener('input', (e) => {
    watchedState.rssForm.errors = '';
    if (feedIsLoaded(e.target.value)) {
      watchedState.rssForm.errors = 'dublicate';
      watchedState.rssForm.data.url = '';
      return;
    }
    watchedState.rssForm.data.url = e.target.value;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.rssForm.status = 'loading';

    getRss(state.rssForm.data.url)
      .then((data) => {
        watchedState.rssForm.data.feeds = [...state.rssForm.data.feeds, data.feeds];
        watchedState.rssForm.data.posts = [...data.posts, ...state.rssForm.data.posts];
        return data.feeds;
      })
      .then((feed) => {
        setTimeout(checkUpdates(feed), timeout);
      })
      .catch((error) => {
        watchedState.rssForm.errors = (error.response)
          ? (`${error.response.status}`)
          : `${error.message}`;
      })
      .finally(() => {
        watchedState.rssForm.status = 'filling';
      });

    e.target.reset();
  });

  document.addEventListener('DOMNodeInserted', () => {
    const btnDetails = document.querySelectorAll('#posts li>.btn');
    // console.log(btnDetails);
    btnDetails.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // eslint-disable-next-line no-param-reassign
        state.rssForm.readedPostsId = [...state.rssForm.readedPostsId, e.target.getAttribute('data-modal')];
        watchedState.rssForm.status = 'modal';
        watchedState.rssForm.status = 'filling';
        console.log('btnDetails');
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

export default setHandlers;
