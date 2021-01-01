import React, { useState } from 'react'
import {
  Button,
  Container,
  Segment,
  Form,
  List,
  Message,
} from 'semantic-ui-react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { nanoid } from 'nanoid'
import { stringDiff } from '../services/stringDiff'
import { toast } from 'react-toastify'

import { getWords } from '../services/dictionary'
import './MainContent.css'

const SearchForm = () => {
  const [results, setResults] = useState([])
  const [userInput, setUserInput] = useState('?1a1?')
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

  const filterResults = (arr1, arr2) => {
    const newArr = stringDiff(arr1, arr2, exclusions)
    setResults((state) => [...state, ...newArr])
    return results
  }

  const handleClick = async (e) => {
    e.preventDefault()
    setResults([])
    if (exclusions.length > 0 || userInput.length > 0) {
      handleValidation(userInput, exclusions)
    }
    const numUserInput = userInput.replace(/\d/g, '?').toLowerCase()
    if (userInput.length > 30) {
      toast(
        'Word search is limited to 30 characters or less. Please adjust search accordingly.'
      )
    } else if (exclusions.length > 25) {
      toast('Exclusions are limited to 25 characters or less.')
    } else {
      const r = await getWords(numUserInput)
      return filterResults(userInput.toLowerCase(), r)
    }
  }

  const copyResults = () => {
    return results?.map((obj) => obj.word)
  }

  const handleCopy = () => {
    setCopied(true)
    toast('List copied!')
  }

  const handleValidation = (input, excl) => {
    const regx = new RegExp(
      '%|&|#|@|,|<|>|`|~|_|=|\\^|\\||\\*|\\$|\\-|\\+|\\[|\\]|\\;|\\/|\\.|\\,|\'|\\(|\\)|\\!|\\"',
      'g'
    )
    const valInput = input?.match(regx)
    const valExcl = excl?.match(regx)
    const fixInput = userInput?.replace(valInput, '')
    const fixExclusions = exclusions?.replace(valExcl, '')
    if (exclusions.length > 0 && userInput.length === 0) {
      toast('Please enter query.')
    } else if (userInput.length > 0 || exclusions.length > 0) {
      setUserInput(fixInput)
      setExclusions(fixExclusions)
      toast('Please restrict entries to letters a - z.')
    }
  }

  return (
    <Container fluid className="content-container">
      <Segment className="main-content">
        <h1>Cryptogram Word Search</h1>
        <List celled>
          <List.Item style={{ display: 'inline-block' }}>
            <List.Content verticalAlign="middle">
              <List.Header as="h2">
                All queries must contain at least one (1) letter a-z.
              </List.Header>
            </List.Content>
          </List.Item>
          <List.Item style={{ display: 'inline-block' }}>
            <List.Content verticalAlign="middle">
              <List.Header as="h2">
                Searches are case-insensitive, i.e., capitalized letters are
                ignored.
              </List.Header>
            </List.Content>
          </List.Item>
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
                Use numeric digits 1 - 9 for two or more of the same letter.
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
            <Form.Input
              label="Exclude: "
              fluid
              iconPosition="left"
              type="text"
              maxLength="25"
              value={exclusions}
              placeholder="Letters to exclude from search query"
              onChange={({ target }) =>
                setExclusions(target.value.toLowerCase())
              }
            />
          </Form.Field>
          <Form.Field inline>
            <Form.Input
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
            <Message error />
          </Form.Field>

          <Button color="teal" size="large" onClick={handleClick}>
            Search
          </Button>
          {results.length > 0 && results[0].word !== 'no matches' ? (
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
            {results.length > 0 ? (
              results.map((obj) => {
                return <List.Item key={nanoid()}>{obj.word}</List.Item>
              })
            ) : (
              <div>no results</div>
            )}
          </List>
        </Form>
      </Segment>
    </Container>
  )
}

export default SearchForm
