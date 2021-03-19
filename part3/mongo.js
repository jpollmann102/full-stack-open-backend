const mongoose = require('mongoose');
require('dotenv').config();

const url =
  `mongodb+srv://fullstack-open-coursework:${process.env.MONGO_DB_PASSWORD}@cluster0.q4mxy.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

// connect to our cluster and database
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

// declare our Number Schema (interface)
const numberSchema = new mongoose.Schema({
  name: String,
  number: String
});

// create Model Number using Schema
const Number = mongoose.model('Number', numberSchema);

if(process.argv.length < 4) {
  // find operation
  Number.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(number => {
      console.log(`${number.name} ${number.number}`);
    });
    mongoose.connection.close();
  });
}else
{
  // insert operation
  const name = process.argv[2];
  const number = process.argv[3];

  // create a new Number object using our Model
  const newNumber = new Number({
    name,
    number,
  });

  // save our new Number
  newNumber.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
