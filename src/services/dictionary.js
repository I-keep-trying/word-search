import axios from 'axios'

const baseUrl = 'https://api.datamuse.com/words?sp='
const udUrl = 'http://api.urbandictionary.com/v0/define?term='

export const getWords = async (word) => {
  const response = await axios.get(`${baseUrl}${word}&max=20`)
  //const response = await axios.get(`${baseUrl}${word}`)
  return response.data
}

export const getUDWords = async (word) => {
  const response = await axios.get(`${udUrl}${word}`)
  return response.data
}
