import React, { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Heading,
  Center,
  Container,
  FormControl,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Button,
  ButtonGroup,
  Flex,
  List,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  Text,
  Tooltip,
  useColorModeValue,
  useColorMode,
  Spacer,
} from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { nanoid } from 'nanoid'
import { stringDiff } from '../services/stringDiff'
import { getWords } from '../services/dictionary'
import { Sun, Moon } from '../components/logos'

import GithubLogo from './GithubIcon-lg'

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <>
      {colorMode === 'light' ? (
        <IconButton
          aria-label="dark mode"
          icon={<Moon />}
          onClick={toggleColorMode}
          variant="link"
        />
      ) : (
        <IconButton
          aria-label="light mode"
          icon={<Sun />}
          onClick={toggleColorMode}
          variant="link"
        />
      )}
    </>
  )
}

const Header = () => {
  return (
    <>
      <Flex
        id="header-wrap"
        bg={useColorModeValue('white', 'gray.800')}
        align="center"
        justify="flex-end"
        wrap="wrap"
        w="100%"
        h="10%"
      >
        <Tooltip
          placement="auto"
          label="link to github repo"
          aria-label="link to github repo"
        >
          <Box mt={3} ml={2} w="5%">
            <GithubLogo />
          </Box>
        </Tooltip>
        <Spacer />
        <Tooltip
          label="toggle light/dark mode"
          aria-label="toggle light/dark mode"
        >
          <Box mt={3} mr={2} w="5%">
            <ThemeToggle />
          </Box>
        </Tooltip>
      </Flex>
    </>
  )
}

const SearchForm = () => {
  const [results, setResults] = useState([])
  const [userInput, setUserInput] = useState('')
  const [exclusions, setExclusions] = useState('')
  // eslint-disable-next-line no-unused-vars
  const [copied, setCopied] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [buttonText, setButtonText] = useState('Sort a-z')
  const [copiedButton, setCopiedButton] = useState('Copy List')
  const [notify, setNotify] = useState({ title: '', msg: '' })
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()

  const isEdge = /Edge/.test(navigator.userAgent)

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      handleSubmit(event)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  const filterResults = (arr1, arr2) => {
    const newArr = stringDiff(arr1, arr2, exclusions)
    setResults((state) => [...state, ...newArr])
    console.log('results', newArr)
    return results
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResults([])
    const numUserInput = userInput.replace(/\d/g, '?').toLowerCase()
    if (userInput.length === 0) {
      onOpen()
      setNotify({
        title: 'Form Incomplete',
        msg: 'Please enter some letters.',
      })
      setTimeout(() => {
        onClose()
      }, 3000)
    } else if (userInput.length > 30) {
      onOpen()
      setNotify({
        title: 'Whoa hang on a minute',
        msg:
          'Word search is limited to 30 characters or less. Please adjust search accordingly.',
      })
      setTimeout(() => {
        onClose()
      }, 3000)
    } else if (exclusions.length > 25) {
      onOpen()
      setNotify({
        title: 'Dont be crazy',
        msg: 'Exclusions are limited to 25 characters or less.',
      })
      setTimeout(() => {
        onClose()
      }, 3000)
    } else if (exclusions.length >= 0 && userInput.length === 0) {
      onOpen()
      setNotify({
        title: 'Missing information',
        msg: 'Please enter something in the search field.',
      })
      setTimeout(() => {
        onClose()
      }, 3000)
    } else {
      setLoading(true)
      handleValidation(userInput, exclusions)

      const r = await getWords(numUserInput)
      setLoading(false)
      if (r[0].word === 'No results') {
        setResults(r)
      } else {
        return filterResults(userInput.toLowerCase(), r)
      }
    }
  }

  const handleValidation = (input, excl) => {
    const regx = new RegExp(
      '0|%|&|#|@|,|<|>|`|~|_|=|\\^|\\||\\*|\\$|\\-|\\+|\\[|\\]|\\;|\\/|\\.|\\,|\'|\\(|\\)|\\!|\\"',
      'g'
    )

    const valInput = input?.match(regx)
    const valExcl = excl?.match(regx)
    const fixInput = userInput?.replace(valInput, '')
    const fixExclusions = exclusions?.replace(valExcl, '')
    if (userInput.length > 0 || exclusions.length > 0) {
      if (valInput || valExcl) {
        setUserInput(fixInput)
        setExclusions(fixExclusions)
        if (valInput[0] === '0') {
          setNotify({ msg: 'Please only use digits 1 - 9 for wildcards.' })
        } else {
          setNotify({ msg: 'Please restrict entries to letters a - z.' })
        }
      }
    }
  }

  const copyResults = () => {
    return results?.map((obj) => obj.word)
  }

  const handleCopy = () => {
    setCopied(true)
    setCopiedButton('List copied!')
    setTimeout(() => {
      setCopiedButton('Copy List')
    }, 3000)
  }

  const resetInputField = () => {
    setUserInput('')
  }

  const resetExclusionsField = () => {
    setExclusions('')
  }

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

  const resetForm = () => {
    setResults([])
    setUserInput('')
    setExclusions('')
    setCopied(false)
  }

  return (
    <>
    <Header />
      <Center h="100px">
        <Heading variant="with-gradient">Word Search</Heading>
      </Center>
      <Flex width="Full" align="center" justifyContent="center">
        <Box textAlign="left" w="90%" maxWidth="500px">
          <Accordion allowMultiple>
            <Tooltip label="Expand for details" aria-label="Expand for details">
              <AccordionItem>
                <AccordionButton>
                  <AccordionIcon />
                  <Box flex="1" textAlign="left">
                    Use one ? for each individual unknown letter.
                  </Box>
                </AccordionButton>
                <AccordionPanel pb={4}>
                  Example: b?ar might return bear, or boar.
                </AccordionPanel>
              </AccordionItem>
            </Tooltip>

            <AccordionItem>
              <AccordionButton>
                <AccordionIcon />
                <Box flex="1" textAlign="left">
                  Use numeric digits 1 - 9 for two or more of the same letter.
                </Box>
              </AccordionButton>
              <AccordionPanel pb={4}>
                For example, if a word has more than one set of repeating
                letters, you can use different numbers for different sets of
                letters. For example, 'balloon' could be 'ba1122n', or
                'excellence' could be: 1xc1221nc1.
              </AccordionPanel>
            </AccordionItem>

            <AccordionItem>
              <AccordionButton>
                <AccordionIcon />
                <Box flex="1" textAlign="left">
                  (Optional) Exclude or filter specific letters from results.
                </Box>
              </AccordionButton>
              <AccordionPanel pb={4}>
                Any letters entered into the 'exclusions' filter will eliminate
                any results containing the excluded letter(s) in the wildcard
                "?" position(s). The provided known letters are ignored, i.e.,
                if your query is 'ba?y', and you exclude the letter 'b', the
                word 'baby' will NOT be included in the returned list.
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <form onSubmit={handleSubmit}>
            <Box my={4} textAlign="left">
              <Tooltip
                label="Enter letters a-z, numbers 1-9, or ?"
                aria-label="Enter letters a-z, numbers 1-9, or ?"
              >
                <FormControl isRequired>
                  <InputGroup>
                    <InputLeftAddon
                      children={
                        <>
                          <Text>Search </Text>
                          <Text color="tomato">*</Text>
                        </>
                      }
                    />
                    <Input
                      id="userinput"
                      className="search-input"
                      type="text"
                      placeholder="ba??"
                      maxLength="30"
                      value={userInput}
                      onChange={(e) => {
                        return setUserInput(e.target.value.toLowerCase())
                      }}
                    />
                    {userInput.length > 0 && !isEdge ? (
                      <InputRightElement
                        children={
                          <IconButton
                            isRound
                            aria-label="reset field"
                            size="sm"
                            icon={<CloseIcon />}
                            onClick={resetInputField}
                          />
                        }
                      />
                    ) : (
                      <></>
                    )}
                  </InputGroup>
                </FormControl>
              </Tooltip>
              <Tooltip
                label="Enter any letters you do not want included in search results."
                aria-label="Enter any letters you do not want included in search results."
              >
                <FormControl mt={6}>
                  <InputGroup>
                    <InputLeftAddon children="Exclude" />
                    <Input
                      className="search-input"
                      type="text"
                      maxLength="25"
                      value={exclusions}
                      placeholder="xyz"
                      onChange={({ target }) =>
                        setExclusions(target.value.toLowerCase())
                      }
                    />
                    {exclusions.length > 0 && !isEdge ? (
                      <InputRightElement
                        children={
                          <IconButton
                            isRound
                            aria-label="reset field"
                            size="sm"
                            icon={<CloseIcon />}
                            onClick={resetExclusionsField}
                          />
                        }
                      />
                    ) : (
                      <></>
                    )}
                  </InputGroup>
                </FormControl>
              </Tooltip>
            </Box>
            <Container textAlign="left">
              <ButtonGroup spacing={[1, 4, 6]}>
                <Tooltip
                  label="Click 'search' or press the enter key to send your query."
                  aria-label="Click 'search' or press the enter key to send your query."
                >
                  <Button onClick={handleSubmit} size="sm" type="submit">
                    Search
                  </Button>
                </Tooltip>
                <Modal isOpen={isOpen} onClose={onClose} isCentered>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>{notify.title} </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>{notify.msg} </ModalBody>
                  </ModalContent>
                </Modal>

                {results.length > 0 ? (
                  <>
                    <Tooltip
                      label="Sort query results alphabetically from a to z. Click again to reverse the sort order."
                      aria-label="Sort query results alphabetically from a to z. Click again to reverse the sort order."
                    >
                      <Button size="sm" onClick={handleSort}>
                        {buttonText}
                      </Button>
                    </Tooltip>

                    <CopyToClipboard
                      className="CopyToClipboard"
                      text={copyResults()}
                      onCopy={handleCopy}
                    >
                      <Tooltip
                        label="Copy search results to your computer's clipboard."
                        aria-label="Copy search results to your computer's clipboard."
                      >
                        <Button size="sm">{copiedButton} </Button>
                      </Tooltip>
                    </CopyToClipboard>

                    <Tooltip
                      label="Erase everything and start a new query."
                      aria-label="Erase everything and start a new query."
                    >
                      <Button size="sm" onClick={resetForm}>
                        Reset
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <></>
                )}
              </ButtonGroup>

              <List
                verticalAlign="middle"
                value={results}
                onChange={() => setCopied(false)}
              >
                {results?.map((obj) => (
                  <ListItem key={nanoid()}>{obj.word}</ListItem>
                ))}
              </List>
            </Container>
          </form>
        </Box>
      </Flex>
    </>
  )
}

export default SearchForm
