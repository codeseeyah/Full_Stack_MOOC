const PersonList = ({ filterText, persons, handleClick }) => {
  const filteredPersons =
    filterText === ''
      ? persons
      : persons.filter(person =>
          person.name.toLowerCase().includes(filterText.toLowerCase())
        )

  return (
    <ul>
      {filteredPersons.map(person => (
        <li key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleClick(person)}>delete</button>
        </li>
      ))}
    </ul>
  )
}

export default PersonList
