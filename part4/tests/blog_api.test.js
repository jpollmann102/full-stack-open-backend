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

describe('when there is initially some blogs saved', () => {
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
});

describe('viewing a specific note', () => {
  test('succeeds with valid id', async () => {
    const blogs = await helper.blogsInDb();

    const blogToView = blogs[0];

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedBlogToView = JSON.parse(JSON.stringify(blogToView));
    expect(resultBlog.body).toEqual(processedBlogToView);

  });

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId();

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404);

  });

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445';

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400);

  });
});

describe('addition of a new note', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: "A new test note",
      author: "A test author",
      url: "atesturl.com",
      likes: 9
    };

    await api
        .post('/api/blogs')
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

    await api
        .post('/api/blogs')
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

    await api
        .post('/api/blogs')
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

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

    const blogsAfterPost = await helper.blogsInDb();

    expect(blogsAfterPost).toHaveLength(helper.initialBlogs.length);

  });
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogs = await helper.blogsInDb();
    const blogToDelete = blogs[0];

    await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204);

    const blogsAfterDelete = await helper.blogsInDb();
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAfterDelete.map(b => b.title);
    expect(titles).not.toContain(blogToDelete.title);

  });

  test('succeeds with status code 204 if id is not in table', async () => {
    const blogIdToDelete = await helper.nonExistingId();

    await api
          .delete(`/api/blogs/${blogIdToDelete}`)
          .expect(204);

    const blogsAfterDelete = await helper.blogsInDb();
    expect(blogsAfterDelete).toHaveLength(helper.initialBlogs.length);

  });
});

describe('updating a blog', () => {
  test('succeeds when incrementing likes of valid blog id', async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];

    const newBlog = {...blogToUpdate, likes: blogToUpdate.likes + 1 };
    await api
          .put(`/api/blogs/${newBlog.id}`)
          .send(newBlog)
          .expect(200)
          .expect('Content-Type', /application\/json/);

    const blogsAfterUpdate = await helper.blogsInDb();

    expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length);

    const updatedBlog = blogsAfterUpdate.find(b => b.id === newBlog.id);
    expect(updatedBlog.likes).toBe(blogToUpdate.likes + 1);

  });

  test('succeeds when decrementing likes of valid blog id', async () => {
    const blogs = await helper.blogsInDb();
    const blogToUpdate = blogs[0];

    const newBlog = {...blogToUpdate, likes: blogToUpdate.likes - 1 };
    await api
          .put(`/api/blogs/${newBlog.id}`)
          .send(newBlog)
          .expect(200)
          .expect('Content-Type', /application\/json/);

    const blogsAfterUpdate = await helper.blogsInDb();

    expect(blogsAfterUpdate).toHaveLength(helper.initialBlogs.length);

    const updatedBlog = blogsAfterUpdate.find(b => b.id === newBlog.id);
    expect(updatedBlog.likes).toBe(blogToUpdate.likes - 1);

  });
});

afterAll(() => {
  mongoose.connection.close();
});
