// this section will be present in all the web pages so adding it to main.jsx
import React from 'react'
import { Button } from '../ui/Button'
function Header() {
  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src="/logo.svg"/>
      <div>
        <Button>Sign In</Button>
      </div>
    </div>
  )
}

export default Header