import React from 'react'
import { Icon, Segment } from 'semantic-ui-react'

function Footer() {
  return (
    <Segment
      textAlign="center"
      inverted
      className="ui bottom fixed three item menu"
    >
      <div className="item"></div>
      <div className="item">
        <Icon name="meh outline" size="big" />
        CopyRight Andrea Crego 2020
      </div>

      <div className="item"></div>
    </Segment>
  )
}

export default Footer
