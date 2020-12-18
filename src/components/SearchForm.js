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

const SearchForm = () => {
  const [results, setResults] = useState([])
  const [userInput, setUserInput] = useState('') //ba1122n
  const [exclusions, setExclusions] = useState('')
  const [copied, setCopied] = useState(false)
  const [message, setMessage] = useState('')

  const filterExclusions = (arr1, arr2) => {
    let wildcards1 = userInput.match(/\*|\?/g)
    let wildcards2 = userInput.match(/\d/g)
    const exArr = exclusions.split('').join('|')
    const regx = new RegExp(`${exArr}`)
    const newArr = arr2.filter(({ word }) => !word.match(regx))

    if (wildcards1 !== null && wildcards2 === null) {
      setResults((state) => [...state, ...newArr])
    } else if (wildcards2 !== null && wildcards1 === null) {
      filterStrings(arr1, newArr)
    }
  }

  const filterStrings = (arr1, arr2) => {
    console.log('arr1', arr1, 'arr2', arr2)
    let newStringArr = arr2?.reduce((acc, item) => {
      if (item.word.length === userInput.length) {
        acc.push(item)
      }
      return acc
    }, [])
    newStringArr.forEach((obj) => {
      const newArr = stringDiff(arr1, obj.word)
      if (newArr.error) {
        toast(`Error: ${newArr.error}; Param: ${obj.word}`)
      } else if (newArr.results.length > 0) {
        setResults((state) => [...state, ...newArr.results])
      } else {
        console.log('else... results', results)
      }
    })
  }

  const handleClick = async (e) => {
    e.preventDefault()
    setResults([])
    let wildcards1 = userInput.match(/\*|\?/g)
    let alpha = userInput.match(/[\d\\?\\*]/g)
    let numeric = userInput.match(/\d/g)
    console.log('alpha', alpha, 'numeric', numeric)
    let r
    if (userInput.length > 10) {
      toast(
        'Word search is limited to 30 characters or less. Please adjust search accordingly.'
      )
    } else if (exclusions.length > 25) {
      toast('Exclusions are limited to 25 characters or less.')
    } else {
      r = await getWords(userInput)
      if (!exclusions) {
        if (wildcards1 !== null || alpha === null) {
          console.log('userInput ? or *', userInput)

          console.log('wildcards1', wildcards1)
          setResults((state) => [...state, ...r])
        } else if (numeric !== null) {
          const regx = /\d/g
          const newUserInput = userInput.replace(regx, '?')
          console.log('newUserInput numeric', newUserInput)
          const s = await getWords(newUserInput)
          filterStrings(userInput, s)
        } else {
          console.log('userInput not numeric', userInput)
        }
      } else {
        filterExclusions(userInput, r)
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

          <br />
          <Button color="teal" size="large" onClick={handleClick}>
            Search
          </Button>
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
