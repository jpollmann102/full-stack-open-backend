const config = require('./utils/config');
const express = require('express');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('connecting to', config.MONGO_DB_URL);
const url = process.env.MONGO_DB_URL;

// connect to our cluster and database
mongoose.connect(config.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(() => {
  logger.info('connected to MongoDB');
})
.catch((error) => {
  logger.error('error connecting to MongoDB:', error.message);
});

const app = express();

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
