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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
