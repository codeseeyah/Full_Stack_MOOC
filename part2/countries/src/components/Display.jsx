import Country from './Country.jsx';

const Display = ({mode, filteredCountries, handleShow, weather}) => {

    return (
        <div>
        {mode === 'overflow' ? (
          "Too many matches, specify another filter"
        ) : mode === 'none' ? (
          "No matches found"
        ) : mode === 'multiple' ? (
          <ul>
            {filteredCountries.map(country => (
              <li key={country.cca3}>
                {country.name.common} <button onClick={() => handleShow(country.cca3)}>show</button>
              </li>
            ))}
          </ul>
        ) : mode === 'single' ? (
          <Country country={filteredCountries[0]} weather={weather} />
        ) : null}
      </div>
    )
}

export default Display;