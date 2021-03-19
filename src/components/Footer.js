import React from 'react'
import {
  Center,
  Text,
  Box,
  Flex,
} from '@chakra-ui/react'
import GithubLogo from './GithubIcon-lg'

const Footer = () => {
  return (
    <>
      <Flex w="100%" mb="8px" className="footer-wrap">
        <Center w="100%">
          <Box w="20">
            <GithubLogo />
          </Box>
          <Text  fontSize="md">
            Made by Andrea Crego 2021
          </Text>
        </Center>
      </Flex>
    </>
  )
}

export default Footer
