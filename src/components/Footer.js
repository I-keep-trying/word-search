import React from 'react'
import { Icon, Segment } from 'semantic-ui-react'

function Footer() {
  return (
    <Segment.Group
      horizontal
      className="ui inverted bottom fixed three item menu"
    >
      <Segment></Segment>
      <Segment inverted>
        <a
          style={{ color: 'white' }}
          href="https://github.com/I-keep-trying/word-search"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="github" size="big" />
        </a>
        CopyRight Andrea Crego 2020
      </Segment>
      <Segment></Segment>
    </Segment.Group>
  )
}

export default Footer
