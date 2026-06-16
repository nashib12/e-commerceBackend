import BreadCrumb from '@/Components/products/ui/BreadCrumb'
import React, { useContext } from 'react'
import PlusIcon from '../../assests/icon/plus.png';
import DataContext from '@/Context/DataContext';
import EditButtonIcon from '../../assests/icon/edit.png'
import { Tooltip } from 'react-tooltip';
import ChangeProductStatusButton from '@/Components/products/ui/ChangeProductStatusButton';
import AddImageIcon from '../../assests/icon/image-add.png';
import AddVariantIcon from '../../assests/icon/add.png';

const Products = () => {
    const { setModal, setUpdateData, product, setProductId } = useContext(DataContext);
  return (
    <div className='max-w-7xl ml-56 mt-32 py-6 px-6'>
        <BreadCrumb title='Products' />
        <div className='border-b pb-3 mb-8 flex items-center justify-between'>
            <div className='flex flex-col gap-1.5'>
                <h2 className='text-2xl font-semibold tracking-wide'>Products</h2>
                <p className='text-lg tracking-wide'>Manage your products</p>
            </div>
            <button onClick={() => setModal('products')} className='h-11 w-fit px-4 cursor-pointer border rounded-sm text-lg flex items-center justify-center gap-3'>
                <img src={PlusIcon} alt="plus button icon" className='h-5 w-5 object-contain' />
                Add New Products
            </button>
        </div>
        <table className='table-auto w-full border'>
            <thead>
                <tr className='bg-gray-100 h-14 border-b text-xl tracking-wide'>
                    <th className='border-r'>S.N.</th>
                    <th className='border-r'>Product Name</th>
                    <th className='border-r'>Category</th>
                    <th className='border-r'>Base Price</th>
                    <th className='border-r'>Sale Price</th>
                    <th className='border-r'>Status</th>
                    <th className='border-r'>Featured</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {product.map((item, index) => (
                    <tr key={`PRT-${item.id}`} className='border-b h-12 text-center text-lg'>
                        <td className='border-r'>{ index + 1}</td>
                        <td className='border-r'>{ item.name}</td>
                        <td className='border-r'> { item.categories?.title }</td>
                        <td className='border-r'> { item.base_price} </td>
                        <td className='border-r'>{ item.sales_amount ? item.sales_amount : 0}</td>
                        <td className='border-r'>
                            <ChangeProductStatusButton id={item.id} state={item.is_active} />
                        </td>
                        <td className='border-r'> { item.is_featured ? (
                            <div className='text-sm h-8 flex font-semibold items-center mx-auto w-fit px-2 border rounded-sm text-white bg-green-700 border-green-700'>
                                Featured
                            </div>
                        ) : (
                            <div className='text-sm h-8 flex items-center font-semibold mx-auto w-fit px-2 border rounded-sm text-white bg-blue-700 border-blue-700'>
                                General
                            </div>
                        ) }</td>
                        <td>
                            <div className='flex items-center justify-center gap-1.5'>
                                <button onClick={() => {
                                    setModal('products');
                                    setUpdateData(item);
                                }} className='mx-auto cursor-pointer' data-tooltip-id='pro-edit' data-tooltip-content='Edit' data-tooltip-place='right'>
                                    <img src={EditButtonIcon} alt="edit button icon" className='h-5 w-5 object-contain' />
                                        <Tooltip id='pro-edit' />
                                </button>
                                <button onClick={() => {
                                    setModal('gallery');
                                    setProductId(item.id);
                                }} className='mx-auto cursor-pointer' data-tooltip-id='pro-add-image' data-tooltip-content='Add new image' data-tooltip-place='right'>
                                    <img src={AddImageIcon} alt="add image button icon" className='h-5 w-5 object-contain' />
                                        <Tooltip id='pro-add-image' />
                                </button>
                                <button onClick={() => {
                                    setModal('variant');
                                    setProductId(item.id);
                                }} className='mx-auto cursor-pointer' data-tooltip-id='pro-add-variant' data-tooltip-content='Add product variant' data-tooltip-place='top'>
                                    <img src={AddVariantIcon} alt="add vartiant icon" className='h-5 w-5 object-contain' />
                                        <Tooltip id='pro-add-variant' />
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

export default Products