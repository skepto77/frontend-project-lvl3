import _ from 'lodash';

const parse = (data, url) => {
  // console.log(data);
  const parser = new DOMParser();
  const rssData = parser.parseFromString(data, 'text/xml');

  if (rssData.querySelector('parsererror')) {
    throw new TypeError('Parse Error');
  }
  // console.log(rssData.querySelector('rss'));
  // if (!rssData.querySelector('rss')) {
  //   throw new TypeError('Parse Error');
  // }

  const result = {
    feeds: null,
    posts: [],
  };

  const id = _.uniqueId();
  const title = rssData.querySelector('title').textContent;
  const items = rssData.querySelectorAll('item');
  const lastDateOfPost = new Date(items[0].querySelector('pubDate').textContent);

  result.feeds = {
    id,
    name: title,
    link: url,
    lastUpdate: lastDateOfPost,
  };
  result.posts = [...items].map((item) => {
    const name = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    const pubDate = new Date(item.querySelector('pubDate').textContent);
    return {
      name,
      link,
      description,
      idFeed: id,
      id: _.uniqueId('p_'),
      pubDate,
    };
  });

  return result;
};

export default parse;
