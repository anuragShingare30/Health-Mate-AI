import React from 'react'
import { NavHeader } from './NavHeader'
import { NavLinks } from './NavLinks'
import { NavProfile } from './NavProfile'

const SideBar = () => {
  return (
    <div>
      <NavHeader></NavHeader>
      <NavLinks></NavLinks>
      <NavProfile></NavProfile>
    </div>
  )
}

export default SideBar
