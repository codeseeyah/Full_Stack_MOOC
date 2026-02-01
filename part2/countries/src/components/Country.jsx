const Country = ({ country, weather }) => {
    return (<>
        <div>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital[0]} km<sup>2</sup></p>
            <p>Area: {country.area}</p>
            <p>Population: {country.population}</p>
            <h2>Languages</h2>
            <ul>
                {Object.values(country.languages).map(language => (
                    <li key={language}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
            {weather ? <>
                <h2>Weather in {country.capital[0]}</h2>
                <p>Temperature: {weather.current.temp_c} °C</p>
                <img src={weather.current.condition.icon} alt={weather.current.condition.text} />
                <p>Wind: {weather.current.wind_kph} kph</p>
            </>
                : null}
        </div></>

    )
}

export default Country;