const mongoose = require('mongoose');
require('dotenv').config();

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
});

module.exports = mongoose.model('Blog', blogSchema);
