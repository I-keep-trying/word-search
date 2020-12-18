import axios from 'axios'

const baseUrl = 'https://api.datamuse.com/words?sp='

export const getWords = (word) => {
  const request = axios.get(`${baseUrl}${word}`)
  return request.then((response) => response.data)
}
