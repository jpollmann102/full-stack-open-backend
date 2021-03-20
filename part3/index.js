const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Number = require('./modules/number');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('build'));

app.get('/api/persons', (request, response) => {
  Number.find({}).then(numbers => {
    response.json(numbers);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Number.findById(request.params.id).then(number => {
    response.json(number);
  });
});

app.delete('/api/persons/:id', (request, response) => {
  // const id = request.params.id;
  // numbers = numbers.filter(number => number.id != id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body.name)
  {
    return response.status(400).json({
      error: 'name missing'
    });
  }else if(!body.number)
  {
    return response.status(400).json({
      error: 'number missing'
    });
  }

  const number = new Number({
    name: body.name,
    number: body.number
  });

  number.save().then(savedNumber => {
    response.json(savedNumber);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
