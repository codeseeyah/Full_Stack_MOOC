require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })
    newPerson.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

// app.get('/info', (request, response) => {
//     const numberOfPersons = persons.length
//     const currentDate = new Date()
//     const info = `<p>Phonebook has information for ${numberOfPersons} people</p><p>${currentDate}</p>`
//     response.send(info)
// })

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

// app.delete('/api/persons/:id', (request, response) => {
//     const id = request.params.id
//     persons = persons.filter(person => person.id !== id)
//     response.status(204).end()
// })

// app.put('/api/persons/:id', (request, response) => {
//     const id = request.params.id
//     const body = request.body
//     const personIndex = persons.findIndex(person => person.id === id)
//     if (personIndex !== -1) {
//         const updatedPerson = { id: id, name: body.name, number: body.number }
//         persons[personIndex] = updatedPerson
//         response.json(updatedPerson)
//     } else {
//         response.status(404).end()
//     }
// })

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

