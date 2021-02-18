import React from 'react'
import { Grid } from '@chakra-ui/react'
import SearchForm from './components/SearchForm'
import Header from './components/header'
import './App.css'

const App = () => {
  return (
    <>
      <Grid direction="column" align="center">
        <Header />
        <SearchForm />
      </Grid>
    </>
  )
}

export default App
