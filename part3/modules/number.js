const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_DB_URL;

// connect to our cluster and database
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.then(result => {
  console.log('connected to MongoDB');
})
.catch(error => {
  console.log('error connecting to MongoDB', error);
});

// declare our Number Schema (interface)
const numberSchema = new mongoose.Schema({
  name: String,
  number: String
});

numberSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// create Model Number using Schema
module.exports = mongoose.model('Number', numberSchema);
