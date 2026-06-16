import Navbar from '@/Components/Navbar'
import Sidebar from '@/Components/Sidebar'
import { ContextProvider } from '@/Context/DataContext'
import React from 'react'


const DashboardLayout = ({ children }) => {

  return (
    <ContextProvider>
        <Navbar/>
        <Sidebar/>
        { children }  
    </ContextProvider>
  )
}

export default DashboardLayout