"use client"
import React from 'react'
import Link from 'next/link'
import DarkThemeToggle from './ui/darkThemeToggle'

const Navbar = () => {
    return (
        <nav className=' bg-[#141416] py-[20px] sticky top-0 text-[#f5f0f0] dark:bg-[#383636] dark:text-white'>
            <div className='flex  px-2 justify-between max-w-[1400px] mx-auto'>
                <div className='flex gap-3'>
                    <Link className='underline  font-semibold text-[17px]' href='about'>About</Link>
                    <Link className='underline  font-semibold text-[17px]' href='Faq'>Faq</Link>
                    {/* <Link href='about'>About</Link> */}

                </div>
                <div> <DarkThemeToggle /></div>
            </div>
        </nav>
    )
}

export default Navbar