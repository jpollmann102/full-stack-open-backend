const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const config = require('../utils/config');
const middleware = require('../utils/middleware');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
                          .populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id)
                          .populate('user', { username: 1, name: 1 });

  if(blogs === null) return response.status(404).end();
  response.json(blogs);
});

blogsRouter.post('/', middleware.extractUser, async (request, response) => {
  const body = request.body;

  if(!request.user.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(request.user.id);

  const blog = new Blog({
    title: body.title,
    user: user._id,
    author: body.author,
    url: body.url
  });

  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  const sendBack = await Blog.findById(savedBlog._id)
                             .populate('user', { username: 1, name: 1 });

  response.status(201).json(sendBack);
});

blogsRouter.delete('/:id', middleware.extractUser, async (request, response, next) => {
  const user = request.user;

  if(!user.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const blogToRemove = await Blog.findById(request.params.id);
  if(blogToRemove.user.toString() !== user.id.toString())
  {
    return response.status(403).json({ error: 'unauthorized' });
  }

  const removeResponse = await Blog.findByIdAndRemove(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });

  const sendBack = await Blog.findById(updatedBlog._id)
                             .populate('user', { username: 1, name: 1 });

  response.json(sendBack);
});

module.exports = blogsRouter;
