import LineChart from '@/Components/charts/LineChart';
import DashboardLayout from '@/Layouts/DashboardLayout';
import React, { useState } from 'react';
import TagIcon from '../../assests/icon/tag.png';

const Index = () => {
    const weekLabel = [
        {id:1, title:"Sunday", balance:"998,203"},
        {id:2, title:"Monday", balance:"678,008"},
        {id:3, title:"Tuesday", balance:"750,002"},
        {id:4, title:"Wednesday", balance:"978,091"},
        {id:5, title:"Thursday", balance:"456,877"},
        {id:6, title:"Friday", balance:"540,078"},
        {id:7, title:"Saturday", balance:"600,350"},
    ];

    const [ balance,setBalance] = useState(weekLabel[0].balance);
  return (
    <div className='max-w-7xl ml-56 mt-32 py-6 px-6'>
        <h1 className='text-3xl tracking-wider font-bold mb-3'>Dashboard</h1>
        <p className='text-lg mb-6'>Welcome back, Admin, Here is what's happening.</p>
        <div className='grid grid-cols-4 gap-6 mb-6'>
            <div className='w-full h-fit border rounded-xl p-4'>
                <h3 className='text-lg font-semibold mb-3'>Total Revenue</h3>
                <div className='flex items-center justify-between mb-3'>
                    <p>Pending Order </p>
                    <span>237/400</span>
                </div>
                <div className='w-full h-1.5 rounded-full relative overflow-hidden mb-3 bg-gray-200'>
                    <div className='h-1.5 bg-green-600 rounded-full w-3/5' />
                </div>
            </div>
            <div className='w-full h-fit border rounded-xl p-4'>
                <h3 className='text-lg font-semibold mb-3'>Total Orders</h3>
                <div className='flex items-center justify-between mb-3'>
                    <p>Pending Order </p>
                    <span>237/400</span>
                </div>
                <div className='w-full h-1.5 rounded-full relative overflow-hidden mb-3 bg-gray-200'>
                    <div className='h-1.5 bg-green-600 rounded-full w-3/5' />
                </div>
            </div>
            <div className='w-full h-fit border rounded-xl p-4'>
                <h3 className='text-lg font-semibold mb-3'>Total Products</h3>
                <div className='flex items-center justify-between mb-3'>
                    <p>Pending Order </p>
                    <span>237/400</span>
                </div>
                <div className='w-full h-1.5 rounded-full relative overflow-hidden mb-3 bg-gray-200'>
                    <div className='h-1.5 bg-green-600 rounded-full w-3/5' />
                </div>
            </div>
            <div className='w-full h-fit border rounded-xl p-4'>
                <h3 className='text-lg font-semibold mb-3'>Total Sales</h3>
                <div className='flex items-center justify-between mb-3'>
                    <p>Pending Order </p>
                    <span>237/400</span>
                </div>
                <div className='w-full h-1.5 rounded-full relative overflow-hidden mb-3 bg-gray-200'>
                    <div className='h-1.5 bg-green-600 rounded-full w-3/5' />
                </div>
            </div>
        </div>
        <div className='grid grid-cols-3 gap-6 mb-6'>
            <div className='col-span-2'>
                <LineChart />
            </div>
            <div className='flex flex-col gap-6'>
                <div className='h-70 w-full bg-[#19B495] text-white px-6 py-6'>
                    <h2 className='text-3xl mb-6'>Earnings</h2>
                    <p className='text-5xl mb-3'>{balance}</p>
                    <p className='text-xl mb-3'>Total Earning</p>
                    <div className='flex flex-wrap gap-2'>
                        {weekLabel.map(item => (
                            <button key={item.id} onClick={() => setBalance(item.balance)} className='cursor-pointer h-9 w-fit px-2 border rounded-sm transition-colors hover:bg-gray-100 hover:text-black border-white'>
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className='h-40 w-full bg-[#3192D2] flex items-center gap-4 px-6 py-6 text-white'>
                    <img src={TagIcon} alt="tag icon" className='h-20 w-20 object-contain invert' />
                    <div>
                        <p className='text-5xl mb-3'>375</p>
                        <p className='text-xl trackig-wide'>Sale Product</p>
                    </div>
                </div>
            </div>
        </div>
        <div className='rounded-lg overflow-hidden'>
            <table className='table-auto w-full '>
                <thead className='bg-gray-200 h-16'>
                    <tr>
                        <th>S.N.</th>
                        <th>Customer</th>
                        <th>Order no.</th>
                        <th>Total</th>
                        <th>Product</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className=''>

                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default Index

Index.layout = (page) => <DashboardLayout>{page}</DashboardLayout>