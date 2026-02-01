import axios from 'axios';
const baseUrlCountries = 'https://studies.cs.helsinki.fi/restcountries/api';
const baseUrlWeather = 'http://api.weatherapi.com/v1/current.json';
const key = import.meta.env.VITE_APIKEY;

const fetchAllCountries = () => {
    return axios.get(`${baseUrlCountries}/all`).then(response => response.data);
}

const fetchCountryByName = (name) => {
    return axios.get(`${baseUrlCountries}/name/${name}`).then(response => response.data);
}

const getCityWeather = (city) => {
    return axios.get(`${baseUrlWeather}?key=${key}&q=${city}`).then(response => response.data);
}

export default { fetchAllCountries, fetchCountryByName, getCityWeather };