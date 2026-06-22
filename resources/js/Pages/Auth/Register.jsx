import AuthLayout from '@/Layouts/AuthLayout'
import React from 'react'
import BackgrunImg from '../../../assests/images/bg.jpg'
import UserLoginForm from '@/Components/auth/UserLoginForm'
import UserRegistrationForm from '@/Components/auth/UserRegistrationForm'

const Register = () => {
  return (
    <div className="relative h-screen w-full ">
        <img src={BackgrunImg} alt="background image" className='absolute inset-0 object-cover h-full w-full' />
        <div className='absolute inset-0 bg-black/40' />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='bg-white rounded-lg border h-fit w-full max-w-5xl grid grid-cols-2 overflow-hidden'>
              <div className='flex items-center h-full border-r'>
                <UserLoginForm />
              </div>
              <UserRegistrationForm />
          </div>
        </div>
    </div>
  )
}

export default Register

Register.layout = (page) => <AuthLayout>{ page }</AuthLayout>
