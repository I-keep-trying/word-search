import React, { useState, useEffect } from 'react'
import {
  IconButton,
  useColorMode,
  Box,
  Flex,
  Spacer,
  useColorModeValue,
  Skeleton,
  Center,
  Heading,
} from '@chakra-ui/react'
import { Logo, Sun, Moon } from '../components/Logo'

export const ThemeToggle = () => {
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

export const Header = () => {
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = () => {
    window.prevOffset = 0
    const position = window.pageYOffset
    const header = document.getElementById('header-wrap')

    setScrollPosition(position)
    if (position > scrollPosition + 25 || position < 100) {
      header.style.top = '-8em'
      header.style.transition = 'top 666ms'
    }
    if (position < scrollPosition - 25 || position < 75) {
      header.style.top = '0'
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <Box w="5%">
          <IconButton
            aria-label="logo"
            variant="link"
            size="lg"
            icon={<Logo />}
          />
        </Box>
        <Spacer />
        <Box ml={0} mr={5} w="5%">
          <ThemeToggle />
        </Box>

        <div className="break"></div>
        <Box w="100%">
          <Skeleton startColor="#ff0080" endColor="#7928CA" height="2px" />
        </Box>
      </Flex>
    </>
  )
}
export default Header
