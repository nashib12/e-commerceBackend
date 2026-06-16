import BreadCrumb from '@/Components/products/ui/BreadCrumb'
import React, { useContext, useEffect } from 'react'
import PlusIcon from '../../assests/icon/plus.png'
import DataContext from '@/Context/DataContext'
import { route } from 'ziggy-js'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '@/Components/products/ui/Loader'
import EditButtonIcon from '../../assests/icon/edit.png'
import DeletButtonIcon from '../../assests/icon/delete.png'

const ShippingFee = () => {
    const { setModal, setUpdateData, setDeleteId, setDeleteType, shippingFee, setShippingFee } = useContext(DataContext);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(route('shippingFee.index'));
                if (response.status === 200){
                    toast.success(response.data.message);
                    setShippingFee(response.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    if (!shippingFee) {
        return <Loader />;
    }
  return (
    <div className='max-w-7xl ml-56 mt-32 py-6 px-6'>
        <BreadCrumb title="Shipping Fee" />
        <div className='border-b pb-3 mb-8 flex items-center justify-between'>
            <div className='flex flex-col gap-1.5'>
                <h2 className='text-2xl font-semibold tracking-wide'>Products</h2>
                <p className='text-lg tracking-wide'>Manage your products</p>
            </div>
            <button onClick={() => setModal('shipping')} className='h-11 w-fit px-4 cursor-pointer border rounded-sm text-lg flex items-center justify-center gap-3'>
                <img src={PlusIcon} alt="plus button icon" className='h-5 w-5 object-contain' />
                Add Shipping fee
            </button>
        </div>
        <table className='table-auto w-full border'>
            <thead>
                <tr className='h-16 border-b bg-gray-100 text-lg tracking-wide'>
                    <th className='border-r'>S.N.</th>
                    <th className='border-r'>Shipping Rate</th>
                    <th className='border-r'>Free Shipping threshold</th>
                    <th className='border-r'>Active status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                { shippingFee.length === 0 ? <tr className='h-14 border-b bg-white text-center py-2'>
                    <td colSpan={5}><h2 className='text-xl font-semibold tracking-wide' >No data found</h2></td>
                </tr> : shippingFee.map((item, index) => (
                    <tr key={`SHP_FEE-${item.id}`} className='h-14 border-b bg-white text-center'>
                        <td className='border-r'>{ index + 1}</td>
                        <td className='border-r'>{ item.flat_rate_fee}</td>
                        <td className='border-r'>{ item.free_shipping_threshold}</td>
                        <td className='border-r'>
                            <button className={`h-8 w-fit px-2 mx-auto flex border rounded ${item.is_active ? 'border-blue-700 text-blue-700' : 'border-red-700 text-red-700'}`}>
                                { item.is_active ? 'Active' : 'Inactive' }
                            </button>
                        </td>
                        <td>
                            <div className='flex items-center gap-2'>
                                <button onClick={() => {
                                    setModal('shipping');
                                    setUpdateData(item);
                                }} className='cursor-pointer mx-auto'>
                                    <img src={EditButtonIcon} alt="edit button icon" className='h-5 w-5 object-contain' />
                                </button>
                                <button onClick={() => {
                                    setModal('delete_confirm');
                                    setDeleteId(item.id);
                                    setDeleteType("shipping_fee");
                                }} className='cursor-pointer mx-auto'>
                                    <img src={DeletButtonIcon} alt="delete button icon" className='h-5 w-5 object-contain' />
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

export default ShippingFee