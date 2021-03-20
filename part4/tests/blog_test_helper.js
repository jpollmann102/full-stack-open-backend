const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: "A new test note",
    author: "Test author",
    url: "testurl.com",
    likes: 10,
    user: "605666e695d5da69f4ffb1e8"
  },
  {
    title: "Another new test note",
    author: "Test author",
    url: "testurl.com/test",
    likes: 3,
    user: "605666e695d5da69f4ffb1e8"
  }
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "to remove",
    author: "to remove",
    url: "to remove",
    likes: 0,
    user: "605666e695d5da69f4ffb1e8"
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
}

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb
}
