import React from 'react'
import DashboardIcon from '../../assests/icon/grid.png'
import OrderIcon from '../../assests/icon/shopping-bag.png'
import ProductIcon from '../../assests/icon/box.png'
import CategoryIcon from '../../assests/icon/category.png'
import CustomerIcon from '../../assests/icon/costumer.png'
import ReviewIcon from '../../assests/icon/comment.png'
import InventoryIcon from '../../assests/icon/shipping.png'
import CouponIcon from '../../assests/icon/coupon.png'
import SettingIcon from '../../assests/icon/setting.png'
import { Link } from '@inertiajs/react'
import CategorizationIco from '../../assests/icon/categorization.png' 
import ShippingIcon from '../../assests/icon/free-delivery.png'
import ShippingFee from '@/Pages/ShippingFee'


const Sidebar = () => {
  return (
    <aside className='fixed top-0 left-0 bottom-0 w-50 bg-gray-200'>
        <div className='flex items-center w-full gap-3 px-4 py-7 border-b border-gray-400'>
            <div className='h-11 w-11 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold uppercase text-xl tracking-wider'>
                <span>MS</span>
            </div>
            <h2 className='font-semibold text-xl tracking-wide'>Dashboard</h2>
        </div>
        <Link href={'/'}>
            <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-4'>
                <img src={DashboardIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
                <h3 className='text-lg tracking-wide'>Overview</h3>
            </div>
        </Link>
        <div className='px-4 py-4'>
            <h3 className='font-semibold tracking-wider uppercase'>Store</h3>
        </div>
        <Link href={'/order-details'}>
            <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
                <img src={OrderIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
                <h3 className='text-lg tracking-wide'>Orders</h3>
            </div>
        </Link>
        <Link href={'/product-page'}>
            <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
                <img src={ProductIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
                <h3 className='text-lg tracking-wide'>Products</h3>
            </div>
        </Link>
        <Link href='/categories'>
        <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
            <img src={CategoryIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
            <h3 className='text-lg tracking-wide'>Categories</h3>
        </div>
        </Link>
        <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
            <img src={CustomerIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
            <h3 className='text-lg tracking-wide'>Customers</h3>
        </div>
        <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
            <img src={ReviewIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
            <h3 className='text-lg tracking-wide'>Reviews</h3>
        </div>
         <div className='px-4 py-4'>
            <h3 className='font-semibold tracking-wider uppercase'>Operations</h3>
        </div>
        <Link href='/product-inventory'>
            <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
                <img src={InventoryIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
                <h3 className='text-lg tracking-wide'>Inventory</h3>
            </div>
        </Link>
        <Link href='/coupon-page'>
            <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
                <img src={CouponIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
                <h3 className='text-lg tracking-wide'>Coupons</h3>
            </div>
        </Link>
        <Link href='/product-attrbiute'>
            <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
                <img src={CategorizationIco} alt="dashboard icon" className='h-5 w-5 object-contain' />
                <h3 className='text-lg tracking-wide'>Attributes</h3>
            </div>
        </Link>
        <Link href='/shipping-fee-page'>
            <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
                <img src={ShippingIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
                <h3 className='text-lg tracking-wide'>Shipping Fee</h3>
            </div>
        </Link>
        <div className='flex items-center gap-3 cursor-pointer transition-colors duration-300 ease-in-out hover:bg-gray-300 px-4 py-2'>
            <img src={SettingIcon} alt="dashboard icon" className='h-5 w-5 object-contain' />
            <h3 className='text-lg tracking-wide'>Settings</h3>
        </div>

    </aside>
  )
}

export default Sidebar