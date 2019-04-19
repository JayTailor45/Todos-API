const express = require('express')
const Sequelize = require('sequelize')

const app = express()
const PORT = 5050

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

const connection = new Sequelize('todosDB','root','',{
    host: 'localhost',
    dialect: 'mysql',
    port: 3333
})

const Todo = connection.define('Todo', {
    name: Sequelize.STRING,
})

app.get('/notes', (req,res)=> {
    Todo.findAll()
    .then((resp) => {
        res.json(resp).status(200)
    })
    .catch((err)=> {
        res.json({"error": JSON.stringify(err)}).status(400)
    })
})

connection.sync({
    logging: console.log,
    force: true
})
.then( ()=> {
    console.log('Connection success')
    app.listen(PORT, ()=> console.log(`Server is running on port ${PORT}`))
})
.catch(err => {
    console.log('Connection failed', err)
})