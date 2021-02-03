import React from 'react'
import {
  Center,
  Image,
  Text,
  Box,
  Link,
  useColorModeValue,
  usePrefersReducedMotion,
} from '@chakra-ui/react'
import GithubLogo from './GithubIcon-lg'

const Footer = () => {
  return (
    <Box bg={useColorModeValue('white', 'gray.800')} id="footer-wrap">
      <Center h="80px">
        <Box>
          <GithubLogo />
        </Box>
        {/*  <Link
          href="https://reactjs.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box maxW="40px">
            <Github />
          </Box>
        </Link> */}
        <Link
          href="https://chakra-ui.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Box maxW="40px"></Box>
        </Link>
      </Center>
    </Box>
  )
}

export default Footer
