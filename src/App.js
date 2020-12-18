import React from 'react'
import { Container } from 'semantic-ui-react'
import HeaderMenu from './components/Heading'
import SearchForm from './components/SearchForm'
import Footer from './components/Footer'
import { ToastContainer, Slide } from 'react-toastify'
import './ReactToastify.css'

const App = () => (
  <Container fluid>
    <HeaderMenu />
    <ToastContainer
      pauseOnFocusLoss={false}
      autoClose={2000}
      transition={Slide}
    />
    <SearchForm />
    <Footer />
  </Container>
)

export default App
