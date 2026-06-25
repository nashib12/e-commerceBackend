import React, { useState } from 'react'
import SearchIcon from '../../assests/icon/search.png'
import NotificationIcon from '../../assests/icon/notification.png'
import ProfileImage from '../../assests/images/pr1.jpg'
import EditIcon from '../../assests/icon/edit.png'
import UserIcon from '../../assests/icon/user.png'
import LogoutIcon from '../../assests/icon/exit.png'
import { route } from 'ziggy-js'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Link, router, usePage } from '@inertiajs/react'

const Navbar = () => {
    const { auth } = usePage().props;
  return (
    <nav className='w-full max-w-7xl mx-auto h-18 bg-gray-300 fixed top-6 right-8 shadow-lg rounded-lg px-6 py-2'>
       <div className='h-full w-full flex items-center justify-between'>
            <div className='flex items-center w-fit h-11 border bg-white rounded-sm overflow-hidden'>
                <input type="text" className='outline-none h-full border-0 px-4 w-60' placeholder='Search for...' />
                <button className='h-full px-4 flex items-center justify-center cursor-pointer'>
                    <img src={SearchIcon} alt="search button icon" className='h-5 w-5 object-contain' />
                </button>
            </div>
            <div className='flex items-center gap-4'>
                <div className='relative cursor-pointer'>
                    <img src={NotificationIcon} alt="notification icon" className='h-10 w-10 object-contain' />
                    <div className='absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-700 text-white text-sm text-center'>
                        <span>2</span>
                    </div>
                </div>
                { auth.user ? <Dropdown/> :
                 <Link href={'/registration'}>
                    <button className='cursor-pointer h-11 w-fit px-4 border rounded'>Login</button>
                 </Link>
                 }
            </div>
       </div>
    </nav>
  )
}

export default Navbar

const Dropdown = () => {
     const [ dropdown, setDropdown ] = useState(false);
     const { handleSubmit } = useForm();
     const onSubmit =  async () => {
        const response = await axios.post(route('logout'));
        if (response.status === 200) {
            toast.success(response.data.message);
            setDropdown(false);
            router.visit('/registration');
        }
     }
    return (
        <div className='relative'>
            <div onClick={() => setDropdown(curr => !curr)} className='relative cursor-pointer'>
                <img src={ProfileImage} alt="profile image" className='h-11 w-11 object-cover rounded-full' />
                <div className='absolute bottom-0 -right-0.5 rounded-full h-4 w-4 bg-green-600 ' />
            </div>
            {  dropdown && 
                <ul className='absolute top-full mt-1 right-0 bg-white shadow-xl rounded-lg h-fit w-50 overflow-hidden'>
                    <li onClick={() => setDropdown(false)} className='flex items-center gap-3 cursor-pointer px-5 py-3 transition-colors duration-300 ease-in-out hover:bg-gray-100'>
                        <img src={UserIcon} alt="view profile button icon" className='h-5 w-5 object-contain' />
                        <span className='tracking-wide'>View profile</span>
                    </li>
                    <li onClick={() => setDropdown(false)} className='flex items-center gap-3 cursor-pointer px-5 py-3 transition-colors duration-300 ease-in-out hover:bg-gray-100'>
                        <img src={EditIcon} alt="view profile button icon" className='h-5 w-5 object-contain' />
                        <span className='tracking-wide '>Change Password</span>
                    </li>
                    <li className='px-5 py-3 transition-colors duration-300 ease-in-out hover:bg-gray-100'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <button type='submit' className='flex items-center gap-3 cursor-pointer'>
                                <img src={LogoutIcon} alt="view profile button icon" className='h-5 w-5 object-contain' />
                                Log Out
                            </button>
                        </form>
                    </li>
                </ul>
            }
        </div>
    );
}