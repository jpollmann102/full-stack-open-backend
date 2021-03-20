const dummy = (blogs) => {
  return 1;
}

const totalLikes = (blogs) => {
  const likes = blogs.reduce((a,b) => a + b.likes, 0);
  return likes;
}

module.exports = {
  dummy,
  totalLikes
}
