import BreadCrumb from '@/Components/products/ui/BreadCrumb'
import DataContext from '@/Context/DataContext'
import DashboardLayout from '@/Layouts/DashboardLayout'
import React, { useContext } from 'react'
import PlusIcon from '../../assests/icon/plus.png'
import EditIcon from '../../assests/icon/edit.png'
import ChangeCouponStatusButton from '@/Components/products/ui/ChangeCouponStatusButton'
import { Tooltip } from 'react-tooltip'
import DeleteIcon from '../../assests/icon/delete.png'

const Coupon = () => {
    const { setModal, setUpdateData, coupon, setDeleteId, setDeleteType } = useContext(DataContext);
  return (
    <div className='max-w-7xl ml-56 mt-32 py-6 px-6'>
        <BreadCrumb title='Coupons' />
        <div className='mb-10 border-b pb-3 flex items-center justify-between'>
            <div className='flex flex-col gap-1.5'>
                <h2 className='text-2xl font-semibold tracking-wider'>Coupons</h2>
                <p className='text-lg tracking-wide'>Manage your coupons</p>
            </div>
            <button onClick={() => setModal('coupon')} className='h-11 w-fit px-4 flex items-center justify-center gap-3 cursor-pointer border rounded-sm text-lg'>
                <img src={PlusIcon} alt="add button icon" className='h-5 w-5 object-contain' />
                Add new coupons
            </button>
        </div>
        <table className='table-auto w-full border'>
            <thead>
                <tr className='bg-gray-100 h-14 border-b text-lg tracking-wide'>
                    <th className='border-r'>S.N.</th>
                    <th className='border-r'>Coupon code</th>
                    <th className='border-r'>Coupon type</th>
                    <th className='border-r'>Value</th>
                    <th className='border-r'>Min order amount</th>
                    <th className='border-r'>Maxium uses</th>
                    <th className='border-r'>Total used</th>
                    <th className='border-r'>Status</th>
                    <th className='border-r'>Expiry date</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {coupon.length === 0 ? 
                <tr className='border-b text-center text-2xl py-4 h-14 font-semibold'>
                    <td colSpan={10}>No data found.</td>
                </tr> : coupon.map((item, index) => (
                    <tr key={`COUP-${item.id}`} className='h-12 border-b text-center'>
                        <td className='border-r'>{ index + 1}</td>
                        <td className='border-r'>{ item.code}</td>
                        <td className='border-r'>{ item.type}</td>
                        <td className='border-r'>{ item.value}</td>
                        <td className='border-r'>{ item.min_order_amount}</td>
                        <td className='border-r'>{ item.max_uses}</td>
                        <td className='border-r'>{ item.used_count}</td>
                        <td className='border-r'><ChangeCouponStatusButton state={item.is_active} id={item.id} /></td>
                        <td className='border-r'>{ new Date(item.expires_at).toISOString().split('T')[0]}</td>
                        <td>
                            <div className='flex items-center justify-center gap-4'>
                                <button className='cursor-pointer' onClick={() => {
                                    setModal('coupon');
                                    setUpdateData(item);
                                }} data-tooltip-id='cop-edit' data-tooltip-content='Edit' data-tooltip-place='right'>
                                    <img src={EditIcon} alt="edit button icon" className='h-6 w-6 object-contain' />
                                    <Tooltip id='cop-edit' />
                                </button>
                                <button className='cursor-pointer' onClick={() => {
                                    setModal('delete_confirm');
                                    setDeleteId(item.id);
                                    setDeleteType('coupon');
                                }} data-tooltip-id='cop-delete' data-tooltip-content='Delete' data-tooltip-place='right'>
                                    <img src={DeleteIcon} alt="delete button icon" className='h-6 w-6 object-contain' />
                                    <Tooltip id='cop-delete' />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default Coupon

Coupon.layout = (page) => <DashboardLayout>{page}</DashboardLayout>