// eslint-disable-next-line new-cap
const apiRouter = require('express').Router();
const Person = require('../models/personModel');

// Get all persons
apiRouter.get('/persons', async (request, response) => {
  try {
    const persons = await Person.find({});
    response.json(persons);
  } catch (error) {
    console.log('error', error);
    response.status(500).json({ error: 'internal server error' });
  }
});

// Get a person by id
apiRouter.get('/persons/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id);
    if (person) {
      response.json(person);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// Add a new person
apiRouter.post('/persons', async (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  const person = new Person({
    name,
    number,
  });

  try {
    const savedPerson = await person.save();
    response.json(savedPerson);
  } catch (error) {
    next(error);
  }
});

// Update a person's number
apiRouter.put('/persons/:id', async (request, response, next) => {
  const { name, number } = request.body;

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' },
    );
    if (updatedPerson) {
      response.json(updatedPerson);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

// Delete a person
apiRouter.delete('/persons/:id', async (request, response, next) => {
  try {
    await Person.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = apiRouter;