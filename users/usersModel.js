const db = require('../database/dbConfig.js');

module.exports = {
  addUser,
  findUser,
  findBy,
  findById,
};

function findUser() {
  return db('users').select('id', 'username', 'password', 'department');
}

function findBy(filter) {
  return db('users').where(filter);
}

async function addUser(user) {
  const [id] = await db('users').insert(user);

  return findById(id);
}

function findById(id) {
  return db('users')
    .where({ id })
    .first();
}