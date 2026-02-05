import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter.jsx'
import NewEntry from './components/NewEntry.jsx'
import PersonList from './components/PersonList.jsx'
import personService from './services/routes.js'
import Notification from './components/Notification.jsx'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState(null)

  const handleFilter = (event) => setFilterText(event.target.value)
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      console.log("promise fulfilled")
      setPersons(initialPersons)
    })
  }, [])

  const addEntry = (event) => {
    event.preventDefault()

    if (newName === '' || newNumber === '') {
      alert('Both name and number fields must be filled out')
      return
    }

    const personArray = persons.map(person => person.name.toLowerCase())

    if (personArray.includes(newName.toLowerCase())) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const personToUpdate = persons.find(person => person.name.toLowerCase() === newName.toLowerCase())
        const updatedPerson = { ...personToUpdate, number: newNumber }
        personService.updatePerson(updatedPerson.id, updatedPerson).then(returnedPerson => {
          console.log(`Updated ${returnedPerson.name}'s number`)
          setPersons(persons.map(person => person.id === updatedPerson.id ? returnedPerson : person))
          setNotificationMessage(`Updated ${returnedPerson.name}'s number`)
          setNotificationClass('success')
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationClass(null)
          }, 5000)
        }).catch((error) => {
          setNotificationMessage(`Information of ${personToUpdate.name} has already been removed from server`)
          setNotificationClass('error')
          setPersons(persons.filter(p => p.id !== personToUpdate.id))
          setTimeout(() => {
            setNotificationMessage(null)
            setNotificationClass(null)
          }, 5000)
        })
      }
      setNewName('')
      setNewNumber('')
      return
    }

    const newPerson = { name: newName, number: newNumber }
    personService.createNewPerson(newPerson).then(createdPerson => {
      setPersons(persons.concat(createdPerson))
      setNewName('')
      setNewNumber('')
      setNotificationMessage(`Added ${createdPerson.name}`)
      setNotificationClass('success')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationClass(null)
      }, 5000)
    })
  }


  const deletePerson = (person) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return
    }
    personService.deletePerson(person.id).then(() => {
      setPersons(persons.filter(p => p.id !== person.id))
      console.log(`Deleted person with id ${person.id}`)
      setNotificationMessage(`Deleted entry`)
      setNotificationClass('success')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationClass(null)
      }, 5000)
    }).catch((error) => {
      setNotificationMessage(`Information of ${person.name} has already been removed from server`)
      setNotificationClass('error')
      setPersons(persons.filter(p => p.id !== person.id))
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationClass(null)
      }, 5000)
    })
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={notificationMessage} className={notificationClass} />
      <Filter filterText={filterText} handleFilter={handleFilter} />
      <h2>Add a new</h2>
      <NewEntry addEntry={addEntry} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <PersonList filterText={filterText} persons={persons} handleClick={deletePerson} />
    </div>
  )
}

export default App