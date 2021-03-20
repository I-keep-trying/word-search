import React from 'react'
import { Grid } from '@chakra-ui/react'
import SearchForm from './components/SearchForm'
import Header from './components/header'
import Footer from './components/Footer'
import './App.css'

const App = () => {
  return (
    <>
      <Grid direction="column" align="center">
        <Header />
        <SearchForm />
        <Footer />
      </Grid>
    </>
  )
}

export default App
