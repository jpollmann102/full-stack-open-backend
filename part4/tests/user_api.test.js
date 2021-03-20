const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const helper = require('./user_test_helper');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);

// beforeEach(async () => {
//   await User.deleteMany({});
//
//   const passwordHash = await bcrypt.hash('secret', 10);
//   const user = new User({ username: 'root', passwordHash });
//
//   await user.save();
// });

describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'jpollmann',
      name: 'Josh Pollmann',
      password: 'supersecretpassword'
    };

    await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/);

    const usersAfterInsert = await helper.usersInDb();
    expect(usersAfterInsert).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAfterInsert.map(u => u.username);
    expect(usernames).toContain(newUser.username);

  });

  test('creation fails with proper statuscode and message if username exists', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'SuperUser',
      password: 'supersecretpassword'
    };

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    const usersAfterInsert = await helper.usersInDb();
    expect(usersAfterInsert).toHaveLength(usersAtStart.length);

  });

  test('creation fails with proper statuscode and message if username less than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'no',
      name: 'Test User',
      password: 'supersecretpassword'
    };

    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username must be at least 3 characters');

    const usersAfterInsert = await helper.usersInDb();
    expect(usersAfterInsert).toHaveLength(usersAtStart.length);

  });
});

afterAll(() => {
  mongoose.connection.close();
});
