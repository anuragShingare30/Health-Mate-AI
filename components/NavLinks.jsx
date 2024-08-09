import React from 'react'
import Link from 'next/link';

let links = [
    {link:'/Chat', tilte:"Start Chat"},
    {link:'/Scheduler', tilte:"Scheduler"},
    {link:'/Profile', tilte:"Visit Profile"},
]

const NavLinks = () => {
  return (
    <div className='flex flex-col gap-4 mt-28'>
      {
        links.map((link)=>{
            return (
                <Link href={link.link} className='rounded-lg'>
                        <button className='btn btn-outline w-full  capitalize'>{link.tilte}</button>
                </Link>
            );
        })
      }
    </div>
  )
}

export {NavLinks};
