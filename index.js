const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(bodyParser.json());

morgan.token("body", (req) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];
//generateId function
const generateId = () => {
  const id = Math.round(Math.random() * 100000);
  return id;
};
//info page
app.get("/info", (req, res) => {
  let date = new Date();
  res.send(`<p>phonebook has info for 2 people</p><br/><p>${date}</p>`);
});

//person list
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

//get unique person info
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => {
    return person.id === id;
  });
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

//delete person from list
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  ``;
  res.status(204).end();
});

//add person to list
app.post("/api/persons/", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({
      error: "name is missing",
    });
  }
  if (!body.number) {
    return res.status(400).json({
      error: "number is missing",
    });
  }
  if (persons.some((person) => person.name === body.name)) {
    return res.status(400).json({
      error: "name must be unique",
    });
  }

  const person = { id: generateId(), name: body.name, number: body.number };
  persons = persons.concat(person);
  res.json(person);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("server running at port 3001");
});
