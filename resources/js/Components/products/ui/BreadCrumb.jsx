import { Link } from '@inertiajs/react'
import React from 'react'

const BreadCrumb = ( {title }) => {
  return (
    <div className='w-full max-w-7xl h-12 mb-6'>
        <h2 className='text-3xl font-semibold tracking-wider'><Link href='/' className='text-blue-700 cursor-pointer'>Dashboard</Link> | <span className='text-2xl'>{title}</span></h2>
        
    </div>
  )
}

export default BreadCrumb