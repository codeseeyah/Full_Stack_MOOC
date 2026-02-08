import axios from 'axios'
const baseUrl = ''

const getAll = () => {
    const req = axios.get(`${baseUrl}/api/persons`)
    return req.then(res => res.data)
}

const createNewPerson = (newPerson) => {
    const req = axios.post(`${baseUrl}/api/persons`, newPerson)
    return req.then(res => res.data)
}

const deletePerson = (id) => {
    const req = axios.delete(`${baseUrl}/api/persons/${id}`)
    return req.then(res => res.data)
}

const updatePerson = (id, newPerson) => {
    const req = axios.put(`${baseUrl}/api/persons/${id}`, newPerson)
    return req.then(res => res.data)
}

export default { getAll, createNewPerson, deletePerson, updatePerson }