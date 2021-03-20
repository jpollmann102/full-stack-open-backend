const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test('blogs are returned as json', async () => {
  await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
});

test('blogs id are defined as id', async () => {
  const blogs = await helper.blogsInDb();

  expect(blogs[0]).toBeDefined();
  expect(blogs[0].id).toBeDefined();
})

test('there are two blog posts', async () => {
  const blogs = await helper.blogsInDb();

  expect(blogs).toHaveLength(helper.initialBlogs.length);
});

test('the first blog is from Test Author', async () => {
  const blogs = await helper.blogsInDb();

  expect(blogs[0].author).toBe(helper.initialBlogs[0].author);
});

test('a specific blog is returned', async () => {
  const blogs = await helper.blogsInDb();

  const titles = blogs.map(b => b.title);
  expect(titles).toContain('Another new test note');
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: "A new test note",
    author: "A test author",
    url: "atesturl.com",
    likes: 9
  };

  await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

  const blogsAfterPost = await helper.blogsInDb();

  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAfterPost.map(b => b.title);
  expect(titles).toContain(newBlog.title);
});

test('a blog without likes defaults to 0', async () => {
  const newBlog = {
    title: "A new test note without likes",
    author: "A test author",
    url: "atesturl.com",
  };

  await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

  const blogsAfterPost = await helper.blogsInDb();

  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length + 1);

  const addedBlog = blogsAfterPost.find(b => b.title === newBlog.title);
  expect(addedBlog.likes).toBe(0);
});

test('blog without title is not added', async () => {
  const newBlog = {
    author: "A test author",
    url: "atesturl.com",
  };

  await api.post('/api/blogs')
      .send(newBlog)
      .expect(400);
      
  const blogsAfterPost = await helper.blogsInDb();

  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length);
});

test('blog without url is not added', async () => {
  const newBlog = {
    title: "A test title",
    author: "A test author",
  };

  await api.post('/api/blogs')
      .send(newBlog)
      .expect(400);

  const blogsAfterPost = await helper.blogsInDb();

  expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
