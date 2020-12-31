import React from 'react'
import { Container } from 'semantic-ui-react'
import HeaderMenu from './components/Heading'
import SearchForm from './components/SearchForm'
import Footer from './components/Footer'
import ViewportProvider from './responsive'
import { ToastContainer, Slide } from 'react-toastify'
import './ReactToastify.css'

const App = () => {
  return (
    <ViewportProvider>
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
    </ViewportProvider>
  )
}

export default App
