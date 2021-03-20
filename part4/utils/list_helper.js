const _ = require('lodash');

const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((a,b) => a + b.likes, 0);
  return likes;
}

const favoriteBlog = (blogs) => {
  const maxItem = blogs.reduce((a, b) => {
    return a.likes > b.likes ? a : b;
  }, {});
  return maxItem;
}

// const mostBlogs = (blogs) => {
//   const authorArray = _.map(blogs, 'author');
//   const mostCommonAuthor = _.chain(authorArray).countBy().sortBy().max(_.last).value();
//   console.log(mostCommonAuthor);
//   return mostCommonAuthor;
// }

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
