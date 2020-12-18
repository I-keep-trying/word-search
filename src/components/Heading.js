import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'

const HeaderMenu = () => {
  return (
    <Menu inverted className="ui top fixed menu">
      <Menu.Item as="a" header>
        <Icon name="meh outline" size="big" />
        Word Search
      </Menu.Item>
      <Menu.Item as="a">Home</Menu.Item>
    </Menu>
  )
}

export default HeaderMenu
