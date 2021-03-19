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

const generateId = () => {
  const maxId = numbers.length > 0 ? Math.max(...numbers.map(n => n.id)) : 0
  return maxId + 1;
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(numbers);
});

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const note = numbers.find(note => note.id == id);
  if(note)
  {
    response.json(note);
  }else
  {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  numbers = numbers.filter(note => note.id != id);

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

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId()
  }

  numbers = numbers.concat(note);

  response.json(note);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
