const Todo = require('../todo') // Schema
const db = require('../../config/mongoose')

db.once('open', () => {
  console.log('mongodb connected!')
  for (let i = 0; i < 10; i++) {
    Todo.create({name: `name-${i}`})
  }
  console.log('done')
})