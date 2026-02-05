const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const newId = Math.floor(Math.random() * 999999).toString()

    if (!body.name || !body.number) {
        response.statusMessage = 'Name or number is missing'
        return response.status(400).end()
    }

    const checkName = persons.find(person => person.name === body.name)
    if (checkName){
        response.statusMessage = 'Name must be unique'
        return response.status(400).end()
    }
    
    const newPerson = {
        id: newId,
        name: body.name,
        number: body.number
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)
})

app.get('/info', (request, response) => {
    const numberOfPersons = persons.length
    const currentDate = new Date()
    const info = `<p>Phonebook has information for ${numberOfPersons} people</p><p>${currentDate}</p>`
    response.send(info)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person){
        response.json(person)
    }  
    else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const body = request.body
    const personIndex = persons.findIndex(person => person.id === id)
    if (personIndex !== -1) {
        const updatedPerson = { id: id, name: body.name, number: body.number }
        persons[personIndex] = updatedPerson
        response.json(updatedPerson)
    } else {
        response.status(404).end()
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

