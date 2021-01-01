import axios from 'axios'

const baseUrl = 'https://api.datamuse.com/words?sp='
const udUrl = 'http://api.urbandictionary.com/v0/define?term='

export const getWords = async (word) => {
  const response = await axios.get(`${baseUrl}${word}`)
  if (response.data.length > 0) {
    return response.data
  } else {
    return [{ word: 'No results' }]
  }
}

export const getUDWords = async (word) => {
  const response = await axios.get(`${udUrl}${word}`)
  return response.data
}
