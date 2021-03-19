const express = require('express');

const app = express();
app.use(express.json());

let numbers = [
  {
    name: "Arto Hellas",
    number: "9876543210",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]

const randomInt = (ceiling) => {
  return Math.floor(Math.random() * Math.floor(ceiling));
}

const generateId = () => {
  return randomInt(500000);
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/info', (request, response) => {
  const content = `
    <div>
      <p>Phonebook has info for ${numbers.length} people</p>
    </div>
    <div>
      <p>${new Date()}</p>
    </div>
  `
  response.send(content);
});

app.get('/api/persons', (request, response) => {
  response.json(numbers);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const number = numbers.find(number => number.id == id);
  if(number)
  {
    response.json(number);
  }else
  {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  numbers = numbers.filter(number => number.id != id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if(!body.content)
  {
    return response.status(400).json({
      error: 'content missing'
    });
  }

  const number = {
    name: body.content,
    number: body.important || false,
    id: generateId()
  }

  numbers = numbers.concat(number);

  response.json(number);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
