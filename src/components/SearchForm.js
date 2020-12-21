import React, { useState } from 'react'
import {
  Button,
  Container,
  Message,
  Segment,
  Form,
  Input,
  List,
  Icon,
} from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { nanoid } from 'nanoid'
import { stringDiff } from '../services/stringDiff'
import { toast } from 'react-toastify'

import { getWords } from '../services/dictionary'
import './MainContent.css'

const wordArr = [
  { word: 'backslide', score: 10903 },
  { word: 'back', score: 9939 },
  { word: 'bar', score: 6002 },
  { word: 'ball', score: 5079 },
  { word: 'bag', score: 4513 },
  { word: 'bank', score: 4396 },
  { word: 'base', score: 4347 },
  { word: 'bay', score: 3721 },
  { word: 'balance', score: 3312 },
  { word: 'band', score: 3090 },
  { word: 'bat', score: 2642 },
  { word: 'badger', score: 2606 },
  { word: 'banal', score: 2339 },
  { word: 'baby', score: 2307 },
  { word: 'bad', score: 2264 },
]
const SearchForm = () => {
  const [results, setResults] = useState([])
  const [userInput, setUserInput] = useState('ba*ll*s') //ba1122n
  const [exclusions, setExclusions] = useState('s')
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')

  const handleExclusions = (arr1, arr2) => {
    console.log('-----------------------------------------------')
    const exArr = exclusions.split('').join('|')
    const regx = new RegExp(`${exArr}`)
    const regx2 = /\*/g
    const arr1Match = [...arr1.matchAll(regx2)]
    console.log('arr1Match', arr1Match)
    /*     const newArr = arr2.filter(({ word }) => {
      console.log('word', word)
      return !word.match(regx)
    })
    console.log('newArr', newArr) */
    //'ba*ll*'
    const newArr2 = arr2.filter(({ word }) => {
      console.log('---word---', word)
      if (word.length < arr1.length) {
        return null
      }
      /*       console.log('arr1Match[0].index', arr1Match[0].index) //2
      console.log('arr1Match[1].index', arr1Match[1].index) //5
      console.log('word.length', word.length) //bagatelle 9
 */
      const input1 = arr1.slice(0, arr1Match[0].index)
      const input2 = arr1.slice(arr1Match[0].index + 1, arr1Match[1].index)
      const input3 = arr1.slice(arr1Match[1].index + 1)
      console.log('input1', input1, 'input2', input2, 'input3', input3)
      const regex1 = new RegExp(`^${input1}`)
      const regex2 = new RegExp(`${input2}`)
      const regex3 = new RegExp(`${input3}$`)
      const word1 = word.match(regex1)
      const word2 = word.match(regex2)
      const word3 = word.match(regex3)
      console.log('word1', word1, 'word2', word2, 'word3', word3)
      const diff = arr1Match[0].index - arr1.length + 1
      const diff2 = arr1Match[1].index - arr1.length + 1
      const diffBetween = arr1Match[1].index - arr1Match[0].index

      const wordSub = word.slice(arr1Match[0].index)
      const wordSubDiff = wordSub.slice(diff)
      const wordSubDiff2 = wordSub.slice(diff2)
      const wordSub00 = word.slice(arr1Match[1].index - 1)
      const wordSub1 = word.slice(0, arr1Match[0].index)
      const wordSub01 = word.slice(arr1Match[0].index + diffBetween)
      const wordSub3 = word.slice(arr1Match[0].index, diff)
      const wordSub03 = word.slice(arr1Match[1].index, diff2)
      const wordSub4 = word.slice(word.length - arr1Match[0].index + 1)
      const wordSub04 = word.slice(word.length - arr1Match[1].index - 1)

      /*       console.log('diff', diff, 'diff2', diff2, 'diffBetween', diffBetween)
      console.log('wordSub', wordSub)
      console.log(
        'wordSubDiff',
        wordSubDiff, // ic from ballistic
        'wordSubDiff2',
        wordSubDiff2
      )
      console.log('wordSub00', wordSub00) // istic from ballistic, oon from balloon, cally from basically
      console.log('wordSub1', wordSub1) // ba from ba*ll*
      console.log('wordSub01', wordSub01)
      console.log('wordSub3', wordSub3) // gate from bagatelle, sica from basically
      console.log('wordSub03', wordSub03)
      console.log('wordSub4', wordSub4)// y from basically, e from bagatelle
      console.log('wordSub04', wordSub04)
 */
      /*         const wordSub1 = word.slice(0, arr1Match[n].index)
        const wordSub2 = wordSub.slice(diff)
        const wordSub3 = word.slice(arr1Match[0].index, diff)
        if (diff === 0) {
          console.log('diff === 0 word')
          word = wordSub2
          console.log('word', word)
          return !word.match(regx)
        } else if (!wordSub3.match(regx)) {
          return word
        } else {
          return null
        } */
    })

    return newArr2
  }

  const filterStrings = (arr1, arr2, reg) => {
    let newStringArr = arr2?.reduce((acc, item) => {
      acc.push(item)
      return acc
    }, [])
    if (reg === null) {
      if (exclusions) {
        setResults((state) => [...state, ...handleExclusions(arr1, arr2)])
      } else {
        setResults((state) => [...state, ...arr2])
      }
    } else if (reg.wildcards !== undefined && reg.numeric === undefined) {
      if (exclusions) {
        setResults((state) => [...state, ...handleExclusions(arr1, arr2)])
      } else {
        setResults((state) => [...state, ...arr2])
      }
    } else if (reg.wildcards === undefined && reg.numeric !== undefined) {
      if (exclusions) {
        const exclArr = handleExclusions(arr1, arr2)
        exclArr.forEach((obj) => {
          const newArr = stringDiff(arr1, obj.word)
          if (newArr.error) {
            toast(`Error: ${newArr.error}; Param: ${obj.word}`)
          } else {
            setResults((state) => [...state, ...newArr.results])
          }
        })
      } else {
        arr2.forEach((obj) => {
          const newArr = stringDiff(arr1, obj.word)
          if (newArr.error) {
            toast(`Error: ${newArr.error}; Param: ${obj.word}`)
          } else {
            setResults((state) => [...state, ...newArr.results])
          }
        })
      }
    } else if (reg.wildcards[0] === '*' && reg.numeric !== undefined) {
      if (exclusions) {
        const exclArr = handleExclusions(arr1, arr2)
        exclArr.forEach((obj) => {
          const newArr = stringDiff(arr1, obj.word)
          /*  const newArr = stringDiff(arr1, obj.word)
          if (newArr.error) {
            toast(`Error: ${newArr.error}; Param: ${obj.word}`)
          } else {
            setResults((state) => [...state, ...newArr.results])
          } */
        })
      } else {
        newStringArr.forEach((obj) => {
          const newArr = stringDiff(arr1, obj.word)
          /* const newArr = stringDiff(arr1, obj.word)
          if (newArr.error) {
            toast(`Error: ${newArr.error}; Param: ${obj.word}`)
          } else {
            setResults((state) => [...state, ...newArr.results])
          } */
        })
      }
    } else {
      console.log('who lands here?')
    }
  }

  const handleClick = async (e) => {
    e.preventDefault()
    setResults([])
    const wildcards = userInput.match(/\*|\?/g)
    const numeric = [...userInput.matchAll(/\d/g)]
    const regx = /\d/g
    let r = []
    let newUserInput
    if (userInput.length > 30) {
      toast(
        'Word search is limited to 30 characters or less. Please adjust search accordingly.'
      )
    } else if (exclusions.length > 25) {
      toast('Exclusions are limited to 25 characters or less.')
    } else {
      if (numeric.length === 0 && wildcards?.length > 0) {
        r = await getWords(userInput)
        filterStrings(userInput, r, { wildcards })
      } else if (numeric.length > 0 && wildcards?.length === undefined) {
        newUserInput = userInput.replace(regx, '?')
        r = await getWords(newUserInput)
        filterStrings(userInput, r, { numeric })
      } else if (wildcards?.length > 0 && numeric?.length > 0) {
        newUserInput = userInput.replace(regx, '?')
        r = await getWords(newUserInput)
        filterStrings(newUserInput, r, { wildcards, numeric })
        return
      } else {
        r = await getWords(userInput)
        filterStrings(userInput, r, wildcards)
      }
    }
  }

  const copyResults = () => {
    return results?.map((obj) => obj.word)
  }

  const handleCopy = () => {
    setCopied(true)
    setMessage(<Message compact>List copied!</Message>)
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  return (
    <Container fluid className="content-container">
      <Segment className="main-content">
        <h1>Cryptogram or Crossword Word Search</h1>

        <List celled>
          <h2>Wildcards:</h2>
          <List.Item>
            <Icon name="question" size="large" />
            <List.Content>
              <List.Header as="h2">
                Use one ? for each individual unknown letter.
              </List.Header>
              Example: b?ar might return bear, or boar.
            </List.Content>
          </List.Item>

          <List.Item>
            <Icon name="asterisk" size="large" />
            <List.Content>
              <List.Header as="h2">
                Use * for unknown number of missing letters (zero or more).
              </List.Header>
              Example: excel* might return excellent, excellence, and
              excellently.
            </List.Content>
          </List.Item>

          <List.Item>
            <Icon name="sort numeric ascending" size="large" />
            <List.Content>
              <List.Header as="h2">
                Use numeric digits 0 - 9 for two or more of the same letter.
              </List.Header>
              For example, if a word has more than one set of repeating letters,
              you can use different numbers for different sets of letters. For
              example, 'balloon' could be 'ba1122n', or 'excellence' could be:
              1xc1221nc1.
            </List.Content>
          </List.Item>

          <List.Item>
            <Icon name="exclamation circle" size="large" />
            <List.Content>
              <List.Header as="h2">Note:</List.Header>
              You may combine the ? and * wildcards all you want, but if you
              combine numeric characters with other wildcards, you may get
              unexpected results, or no results at all.
              <br />
              Also, be sure to include at least one alpha (non-numeric)
              character.
            </List.Content>
          </List.Item>
        </List>

        <br />
        <Form>
          <Form.Field inline>
            <Input
              label="Exclude: "
              fluid
              iconPosition="left"
              type="text"
              maxLength="25"
              value={exclusions}
              placeholder="Letters to exclude from search query"
              onChange={({ target }) => setExclusions(target.value)}
            />
          </Form.Field>
          <Form.Field inline>
            <Input
              fluid
              icon="search"
              iconPosition="left"
              placeholder="ab??ef"
              type="text"
              maxLength="30"
              value={userInput}
              onChange={({ target }) =>
                setUserInput(target.value.toLowerCase())
              }
            />
          </Form.Field>

          <Button color="teal" size="large" onClick={handleClick}>
            Search
          </Button>
          {JSON.stringify(results)}
          {results.length > 0 ? (
            <CopyToClipboard
              className="CopyToClipboard"
              text={copyResults()}
              onCopy={handleCopy}
            >
              <Button color="teal" size="large">
                Copy List
              </Button>
            </CopyToClipboard>
          ) : (
            <></>
          )}
          {copied ? <div>{message} </div> : <></>}

          <List
            verticalAlign="middle"
            value={results}
            onChange={() => setCopied(false)}
          >
            {results?.map((obj) => (
              <List.Item key={nanoid()}>{obj.word}</List.Item>
            ))}
          </List>
        </Form>
      </Segment>
    </Container>
  )
}

export default SearchForm
