import React, { useState } from 'react'
import { stringDiff } from './stringDiff1'

const stringArray = [
  { word: 'bassoon', score: 371 },
  { word: 'barroon', score: 371 },
  { word: 'babboon', score: 371 },
]

const App = () => {
  const [results, setResults] = useState([])
  const [error, setError] = useState('')

  const input2 = '123445263v362544321'
  const bLines = [{ word: 'saippuakivikauppias' }]

  const input = 'ba1122n'
  const excl = ['r']

  let newStringArr = stringArray.reduce((acc, item) => {
    if (item.word.length === input.length) {
      acc.push(item)
    }
    return acc
  }, [])


  const filterStrings = (arr1, arr2) => {
    arr2.forEach((obj) => {
      const resC = stringDiff(arr1, obj.word, excl)
      if (resC.error) {
        setError(`Error: ${resC.error}; Param: ${obj.word}`)
      }
      if (resC.match === false) {
        console.log('no match')
      } else {
        console.log(`${obj.word} is matched by input ${arr1}`)
        setResults((state) => [...state, ...resC.results])
      }
    })
  }

  const handleClick = (e) => {
    e.preventDefault()
    filterStrings(input, newStringArr)
  }

  return (
    <div className="App">
      {results.map((result) => (
        <div>{result} </div>
      ))}
      <br />
      {JSON.stringify(error)}
      <br />
      <button onClick={handleClick}>useC</button>
    </div>
  )
}

export default App
