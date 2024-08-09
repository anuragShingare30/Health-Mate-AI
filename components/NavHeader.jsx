import React from 'react'
import { CiPill } from "react-icons/ci";
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';

const NavHeader = () => {
  return (
    <div className='flex items-center gap-10 mb-10'>
      <Link href='/'>
        <div className='flex items-center gap-2'>
          {/* <CiPill className='text-3xl' /> */}
          <img src="doctor.png" alt="logo" width='40px'/>
          <h1 className='text-xl'>Health Mate AI</h1>
        </div>
      </Link>


      <ThemeToggle></ThemeToggle>


    </div>
  )
}

export { NavHeader };
