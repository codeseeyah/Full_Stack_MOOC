import { useEffect, useState } from 'react'
import axios from 'axios'
import countryService from './services/routes.js'
import Display from './components/Display.jsx'

function App() {

  const [countries, setCountries] = useState([])
  const [mode, setMode] = useState('all')
  const [filter, setFilter] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])
  const [weather, setWeather] = useState(null)


  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('filtering with', filter)
    const filtered = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()) || country.name.official.toLowerCase().includes(filter.toLowerCase()))
    setFilteredCountries(filtered)
    console.log('filtered countries number:', filtered.length)
    if (filtered.length > 10) {
      setMode('overflow')
    }
    else if (filtered.length === 0) {
      setMode('none')
      console.log('no matches found')
    }
    else if (filtered.length > 1) {
      setMode('multiple')
      console.log('multiple matches found:', filtered.length)
    }
    else if (filtered.length === 1) {
      setMode('single')
      console.log('single match found')
      countryService.getCityWeather(filtered[0].capital[0]).then(data => {
        console.log('weather fetched')
        setWeather(data)
      })
    }
  }

  const handleShow = (cca3) => {
    const countryToShow = countries.filter(country => country.cca3 === cca3)
    setFilteredCountries(countryToShow)
    setWeather(null)
    countryService.getCityWeather(countryToShow[0].capital[0]).then(data => {
      console.log('weather fetched for show button')
      setWeather(data)
    })
    setMode('single')
  }

  useEffect(() => {
    countryService.fetchAllCountries().then(data => {
      setCountries(data)
      console.log('countries successfully fetched')
    })
      .catch(error => console.error('Error fetching all countries:', error));
  }, [])

  return (
    <>
      <p>Find countries: </p>

      <form name='country-filter' onSubmit={handleSubmit}>
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <Display mode={mode} filteredCountries={filteredCountries} handleShow={handleShow} weather={weather} />
    </>
  )
}

export default App
