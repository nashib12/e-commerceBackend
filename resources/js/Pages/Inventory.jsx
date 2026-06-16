import BreadCrumb from '@/Components/products/ui/BreadCrumb'
import Loader from '@/Components/products/ui/Loader';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';
import EditButtonIcon from '../../assests/icon/edit.png'
import DeleteButtonIcon from '../../assests/icon/delete.png'
import { Tooltip } from 'react-tooltip';
import DataContext from '@/Context/DataContext';

const Inventory = () => {
    const { setUpdateData, setModal, setDeleteId, setDeleteType, inventory, setInventory, setProductId } = useContext(DataContext);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        setLoading(true);
        async function fetchData() {
            try {
                const response = await axios.get(route('productVariant.index'));
                if (response.status === 200){
                    toast.success(response.data.message);
                    setInventory(response.data.data);
                }
            } catch (error) {
                toast.error("There was some error during fetching the data.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
        return;
    }, []);

    if (loading) {
        return (
            <div className='max-w-7xl ml-56 mt-32'>
                <Loader />
            </div>
        )
    }

  return (
    <div className='max-w-7xl ml-56 mt-32 py-6 px-6'>
        <BreadCrumb title='Inventory' />
        <div className='mb-10 border-b pb-3 flex flex-col gap-1.5'>
            <h2 className='text-2xl font-semibold tracking-wider'>Inventory</h2>
            <p className='text-lg tracking-wide'>Manage your product inventory</p>   
        </div>
        <table className='table-auto border w-full'>
            <thead>
                <tr className='h-16 border-b bg-gray-200 text-lg'>
                    <th className='border-r'>S.n.</th>
                    <th className='border-r'>Product Id</th>
                    <th className='border-r'>Price (Rs.)</th>
                    <th className='border-r'>Stock</th>
                    <th className='border-r'>Low stock</th>
                    <th className='border-r'>Color</th>
                    <th className='border-r'>Size</th>
                    <th className='border-r'>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                { inventory.length === 0 ? (
                    <tr className='h-14 border-b text-center py-4'>
                        <td className='text-3xl font-semibold tracking-wide' colSpan={9}>No data found.</td>
                    </tr>
                ) : ( inventory.map((item, index) => (
                    <tr key={`INV-${item.id}`} className='h-14 border-b text-lg text-center'>
                        <td className='border-r'>{ index + 1}</td>
                        <td className='border-r'>{ item.product_id }</td>
                        <td className='border-r'> { item.price_override } </td>
                        <td className='border-r'> { item.stock_qty } </td>
                        <td className='border-r'>{ item.low_stock_threshold }</td>
                        <td className='border-r'> { item.attribute_values[0]?.value} </td>
                        <td className='border-r'> { item.attribute_values[1]?.value}</td>
                        <td className='border-r'> 
                            { item.is_active ? (
                                <button className='h-8 w-fit mx-auto px-2 border rounded border-green-700 text-green-700 text-sm'>Active</button>
                            ) : (
                                <button className='h-8 w-fit mx-auto px-2 border rounded border-red-700 text-red-700 text-sm'>Inactive</button>
                            )}
                        </td>
                        <td>
                            <div className='flex items-center'>
                                <button onClick={() => {
                                    setModal('variant');
                                    setUpdateData(item);
                                    setProductId(item.product_id);
                                }} className='mx-auto cursor-pointer w-fit' data-tooltip-id='edit-btn' data-tooltip-content='Edit' data-tooltip-place='left'>
                                    <img src={EditButtonIcon} alt='edit button icon' className='h-6 w-6 object-contain' />
                                    <Tooltip id='edit-btn' />
                                </button>
                                <button onClick={() => {
                                    setModal('delete_confirm');
                                    setDeleteId(item.id);
                                    setDeleteType('variant');
                                }} className='mx-auto cursor-pointer w-fit' data-tooltip-id='delete-btn' data-tooltip-content='Delete' data-tooltip-place='left'>
                                    <img src={DeleteButtonIcon} alt='delete button icon' className='h-6 w-6 object-contain' />
                                    <Tooltip id='delete-btn' />
                                </button>
                            </div>
                        </td>
                    </tr>
                )) // table row ends here
                )}
            </tbody>
        </table>
    </div>
  )
}

export default Inventory