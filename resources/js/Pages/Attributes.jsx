import BreadCrumb from '@/Components/products/ui/BreadCrumb'
import React, { useContext } from 'react'
import PlusIcon from '../../assests/icon/plus.png'
import DataContext from '@/Context/DataContext'
import { Tooltip } from 'react-tooltip'
import EditIcon from '../../assests/icon/edit.png';
import DeleteIcon from '../../assests/icon/delete.png';

const Attributes = () => {
    const { setModal, attributeValue, setUpdateData, setDeleteId, setDeleteType, attribute} = useContext(DataContext);

  return (
    <div className='max-w-7xl ml-56 mt-32 py-6 px-6'>
        <BreadCrumb title='Product Attributes' />
         <div className='flex items-center justify-between w-full border-b pb-3 mb-10'>
            <div className='flex flex-col gap-1.5'>
                <h2 className='text-2xl font-semibold tracking-wider'>Product Attribute</h2>
                <p className='text-lg tracking-wide'>Manage your product attribute types</p>
            </div>
            <div className='flex items-center gap-4'>
                <button onClick={() => setModal('attribute')} className='h-11 w-fit px-4 flex items-center justify-center gap-3 cursor-pointer border rounded-sm text-lg'>
                    <img src={PlusIcon} alt="add button icon" className='h-5 w-5 object-contain' />
                    Add new attribute
                </button>
                <button onClick={() => setModal('attribute_value')} className='h-11 w-fit px-4 flex items-center justify-center gap-3 cursor-pointer border rounded-sm text-lg'>
                    <img src={PlusIcon} alt="add button icon" className='h-5 w-5 object-contain' />
                    Add attribute value
                </button>
            </div>
        </div>
        <div className='grid grid-cols-2 gap-6'>
            <div>
                <h2 className='mb-6 text-2xl font-semibold tracking-wide'>Attribute details</h2>
                <table className='table-auto w-full border h-fit'>
                    <thead>
                        <tr className='bg-gray-100 h-16 border-b text-xl tracking-wide'>
                            <th className='border-r'>S.n.</th>
                            <th className='border-r'>Name</th>
                            <th className='border-r'>Type</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { attribute.length === 0 ? 
                            <tr className='h-14 border-b text-center text-xl font-semibold py-4'>
                                <td colSpan={4} >No data found.</td>
                            </tr> : attribute.map((item, index) => (
                                <tr className='h-14 border-b text-center text-lg' key={`ATTR-${item.id}`}>
                                    <td className='border-r'>{ index + 1}</td>
                                    <td className='border-r'> {item.name}</td>
                                    <td className='border-r'> {item.type}</td>
                                    <td>
                                    <div className='flex items-center gap-4 justify-center'>
                                        <button className='cursor-pointer' onClick={() => {
                                            setModal('attribute');
                                            setUpdateData(item);
                                        }} data-tooltip-id='attr-edit-1' data-tooltip-content='Edit' data-tooltip-place='right'>
                                            <img src={EditIcon} alt="edit button icon" className='h-6 w-6 object-contain' />
                                            <Tooltip id='attr-edit-1' />
                                        </button>
                                        <button className='cursor-pointer' onClick={() => {
                                            setModal('delete_confirm');
                                            setDeleteId(item.id);
                                            setDeleteType('attribute');
                                        }} data-tooltip-id='attr-delete-1' data-tooltip-content='Delete' data-tooltip-place='right'>
                                            <img src={DeleteIcon} alt="delete button icon" className='h-6 w-6 object-contain' />
                                            <Tooltip id='attr-delete-1' />
                                        </button>
                                    </div>
                                </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2 className='mb-6 text-2xl font-semibold tracking-wide'>Attribute value details</h2>
                <table className='table-auto w-full border h-fit'>
                    <thead>
                        <tr className='bg-gray-100 h-16 border-b text-xl tracking-wide'>
                            <th className='border-r'>S.n.</th>
                            <th className='border-r'>Attribute Value</th>
                            <th className='border-r'>Attribute Name</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { attributeValue.length === 0 ? 
                        <tr className='h-14 border-b text-center text-xl font-semibold py-4' >
                            <td colSpan={4} >No data found.</td>
                        </tr>  : attributeValue.map((item, index) => (
                            <tr className='h-14 border-b text-center text-lg' key={`ATTRVA-${item.id}`}>
                                <td className='border-r'>{ index + 1 }</td>
                                <td className='border-r'>{ item.value}</td>
                                <td className='border-r'>{ item.attribute?.name}</td>
                                <td>
                                    <div className='flex items-center gap-4 justify-center'>
                                        <button className='cursor-pointer' onClick={() => {
                                            setModal('attribute_value');
                                            setUpdateData(item);
                                        }} data-tooltip-id='attr-edit' data-tooltip-content='Edit' data-tooltip-place='right'>
                                            <img src={EditIcon} alt="edit button icon" className='h-6 w-6 object-contain' />
                                            <Tooltip id='attr-edit' />
                                        </button>
                                        <button className='cursor-pointer' onClick={() => {
                                            setModal('delete_confirm');
                                            setDeleteId(item.id);
                                            setDeleteType('attribute_value');
                                        }} data-tooltip-id='attr-delete' data-tooltip-content='Delete' data-tooltip-place='right'>
                                            <img src={DeleteIcon} alt="delete button icon" className='h-6 w-6 object-contain' />
                                            <Tooltip id='attr-delete' />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default Attributes