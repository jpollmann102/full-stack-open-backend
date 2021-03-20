const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Number = require('./modules/number');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static('build'));

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  Number.countDocuments({}, (err, count) => {
    const content = `
      <div>
        <p>Phonebook has info for ${count} people</p>
      </div>
      <div>
        <p>${new Date()}</p>
      </div>
    `;
    response.send(content);
  });
});

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
  Number.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end();
  })
  .catch(error => next(error));
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

app.put('/api/persons/:id', (request, response) => {
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

  const number = {
    name: body.name,
    number: body.number
  };

  Number.findByIdAndUpdate(request.params.id, number, { new: true })
  .then(updatedNumber => {
    response.json(updatedNumber);
  })
  .catch(error => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if(error.name === 'CastError')
  {
    return response.status(400).send({ error: 'malformatted id' });
  }else if(error.name === 'ValidationError')
  {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
