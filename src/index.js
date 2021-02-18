import React from 'react'
import ReactDOM from 'react-dom'
import { ChakraProvider } from '@chakra-ui/react'
import extendTheme from './theme.js'
import { Fonts } from './Fonts/Fonts'

import App from './App'


ReactDOM.render(
  <ChakraProvider theme={extendTheme}>
    <Fonts />
    <App />
  </ChakraProvider>,
  document.getElementById('root')
)
