import React, { useState } from 'react'
import {
  Button,
  Container,
  Segment,
  Form,
  Input,
  List,
} from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { nanoid } from 'nanoid'
import { stringDiff } from '../services/stringDiff'
import { toast } from 'react-toastify'

import { getWords } from '../services/dictionary'
import './MainContent.css'

const SearchForm = () => {
  const [results, setResults] = useState([])
  const [userInput, setUserInput] = useState('')
  const [exclusions, setExclusions] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [copied, setCopied] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [buttonText, setButtonText] = useState('Sort a-z')

  const handleSort = () => {
    const newResults = [...results]
    const sort1 = results.sort((a, b) => (a.word < b.word ? 1 : -1))
    const sort1tog = () => {
      setToggle(false)
      setButtonText('Sort a - z')

      setResults(sort1)
    }
    const sort2 = newResults.sort((a, b) => (a.word < b.word ? -1 : 1))

    const sort2tog = () => {
      setToggle(true)
      setButtonText('Sort z - a')

      setResults(sort2)
    }
    toggle === false ? sort2tog() : sort1tog()
  }

  const filterExclusions = async (arr, reg) => {
    const exArr = exclusions.split('').join('|')
    const regx = new RegExp(`${exArr}`, 'g')
    const reduceArr = arr.reduce((acc, item) => {
      for (let i in reg) {
        let currChar = item.word.charAt(reg[i].index)
        let matchedItem = [...currChar.matchAll(regx)]
        if (matchedItem.length > 0) {
          acc.push(item.word)
        }
      }
      return acc
    }, [])

    const filterArr = arr.filter((obj) => {
      return reduceArr.includes(obj.word) ? null : obj.word
    })
    if (reg[0][0] !== '?') {
      filterStrings(userInput, filterArr)
    } else {
      setResults((state) => [...state, ...filterArr])
    }
  }

  const filterStrings = (arr1, arr2) => {
    return arr2.forEach((obj) => {
      const newArr = stringDiff(arr1, obj.word)

      if (newArr.error) {
        toast(`Error: ${newArr.error}; Param: ${obj.word}`)
      } else if (newArr.results.length > 0) {
        setResults((state) => [...state, ...newArr.results])
      } else {
        return results
      }
    })
  }

  const handleClick = async (e) => {
    e.preventDefault()
    setResults([])
    let wildcards1 = [...userInput.matchAll(/\?/g)]
    let numeric = userInput.match(/\d/g)
    let wildcards2 = [...userInput.matchAll(/\d/g)]
    const regx = /\d/g
    const numUserInput = userInput.replace(regx, '?')
    let r
    if (userInput.length > 10) {
      toast(
        'Word search is limited to 30 characters or less. Please adjust search accordingly.'
      )
    } else if (exclusions.length > 25) {
      toast('Exclusions are limited to 25 characters or less.')
    } else if (!exclusions) {
      if (wildcards1.length > 0 || numeric === null) {
        r = await getWords(userInput)
        setResults((state) => [...state, ...r])
      } else if (numeric !== null) {
        r = await getWords(numUserInput)
        return filterStrings(userInput, r)
      } else {
        toast('something weird happened...')
      }
    } else {
      if (wildcards1.length > 0) {
        r = await getWords(userInput)
        return filterExclusions(r, wildcards1)
      } else {
        r = await getWords(numUserInput)
        return filterExclusions(r, wildcards2)
      }
    }
  }

  const copyResults = () => {
    return results?.map((obj) => obj.word)
  }

  const handleCopy = () => {
    setCopied(true)
    toast('List copied!')
  }

  return (
    <Container fluid className="content-container">
      <Segment className="main-content">
        <h1>Cryptogram Word Search</h1>
        <List celled>
          <List.Item style={{ display: 'inline-block' }}>
            <List.Content verticalAlign="middle">
              <List.Header as="h2">
                Use one ? for each individual unknown letter.
              </List.Header>
              Example: b?ar might return bear, or boar.
            </List.Content>
          </List.Item>
          <List.Item>
            <List.Content verticalAlign="middle">
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
            <List.Content verticalAlign="middle">
              <List.Header as="h2">Exclusions:</List.Header>
              Any letters entered into the 'exclusions' filter will eliminate
              any results containing the excluded letter(s) in the wildcard "?"
              position(s). The provided known letters are ignored, i.e., if your
              query is 'ba?y', and you exclude the letter 'b', the word 'baby'
              will NOT be included in the returned list.
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
          {results.length > 0 ? (
            <>
              <Button color="teal" size="large" onClick={handleSort}>
                {buttonText}
              </Button>
              <CopyToClipboard
                className="CopyToClipboard"
                text={copyResults()}
                onCopy={handleCopy}
              >
                <Button color="teal" size="large">
                  Copy List
                </Button>
              </CopyToClipboard>
            </>
          ) : (
            <></>
          )}
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
