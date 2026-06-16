import BreadCrumb from '@/Components/products/ui/BreadCrumb'
import React, { useContext } from 'react'
import PlusIcon from '../../assests/icon/plus.png'
import ChangeStatusButton from '@/Components/products/ui/ChangeStatusButton'
import EditIcon from '../../assests/icon/edit.png'
import { Tooltip } from 'react-tooltip'
import DataContext from '@/Context/DataContext'
import DashboardLayout from '@/Layouts/DashboardLayout'

const Categories = () => {

    const { setModal, category, setUpdateData } = useContext(DataContext);

  return (
    <div className='max-w-7xl ml-56 mt-32 py-6 px-6'>
        <BreadCrumb title='Category' />
        <div className='flex items-center justify-between w-full border-b pb-3 mb-10'>
            <div className='flex flex-col gap-1.5'>
                <h2 className='text-2xl font-semibold tracking-wider'>Categories</h2>
                <p className='text-lg tracking-wide'>Manage your product categories</p>
            </div>
            <button onClick={() => setModal('category')} className='h-11 w-fit px-4 flex items-center justify-center gap-3 cursor-pointer border rounded-sm text-lg'>
                <img src={PlusIcon} alt="add button icon" className='h-5 w-5 object-contain' />
                Add new cateogry
            </button>
        </div>
        <table className='table-auto w-full border'>
            <thead>
                <tr className='bg-gray-100 h-14 border-b text-xl tracking-wide'>
                    <th className='border-r'>S.N.</th>
                    <th className='border-r'>Title</th>
                    <th className='border-r'>Parent Category</th>
                    <th className='border-r'>Image</th>
                    <th className='border-r'>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {category.map((item , index)=> (
                    <tr key={`CAT-${item.id}`} className='h-14 border-b text-center text-lg'>
                        <td className='border-r'>{ index + 1}</td>
                        <td className='border-r'> { item.title }</td>
                        <td className='border-r'>{ item.parent ? item.parent.title : 'Null'}</td>
                        <td className='border-r'>
                            <img src={item.image_url} alt={item.title} className='h-12 w-fit mx-auto object-contain rounded-sm' />
                        </td>
                        <td className='border-r'>
                            <ChangeStatusButton state={item.is_active} id={item.id} />
                        </td>
                        <td>
                        <button onClick={() => {setUpdateData(item); setModal("category")}} className='cursor-pointer' data-tooltip-id='cat-edit' data-tooltip-content='Edit' data-tooltip-place='right' >
                            <img src={EditIcon} alt="edit button icon" className='h-6 w-6 object-contain' />
                        </button>
                        <Tooltip id='cat-edit' />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  )
}

export default Categories

Categories.layout = (page) => <DashboardLayout>{page}</DashboardLayout>