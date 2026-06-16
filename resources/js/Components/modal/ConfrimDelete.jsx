import React, { useContext } from 'react'
import CrossButtonIcon from '../../../assests/icon/cross-button.png'
import DataContext from '@/Context/DataContext'
import { route } from 'ziggy-js'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useForm } from 'react-hook-form'

const ConfrimDelete = () => {
    const { setModal, deleteId, deleteType, setDeleteId, setDeleteType, setAttributValue, setCoupon
        , setAttribute, setShippingFee, setInventory
     } = useContext(DataContext);
    const { handleSubmit } = useForm();

    const handleDeleteSucess = ({response}) => {
        toast.success(response.data.message);
        setModal('');
        setDeleteId('');
        setDeleteType('');
    }
    const handleDelete = async () => {
        
        switch ( deleteType ) {
            case "attribute_value":
                const attributeValueRes = await axios.delete(route('attributeValue.delete', deleteId));
            
                if (attributeValueRes.status === 200){
                    setAttributValue(prev => prev.filter(item => item.id !== deleteId));
                    handleDeleteSucess({ response : attributeValueRes});
                }
                break;
            case "coupon":
                const couponRes = await axios.delete(route('coupon.delete', deleteId));
                if (couponRes.status === 200){
                    setCoupon(prev => prev.filter(item => item.id !== deleteId));
                    handleDeleteSucess({ response : couponRes});
                }
                break;
            case "attribute":
                const attributeRes = await axios.delete(route('attribute.delete', deleteId));
                if (attributeRes.status === 200){
                    setAttribute(prev => prev.filter(item => item.id !== deleteId));
                    handleDeleteSucess({ response: attributeRes });
                }
            case "shipping_fee":
                const shippingFeeRes = await axios.delete(route('shippingFee.destroy', deleteId));
                if (shippingFeeRes.status === 200) {
                    setShippingFee(prev => prev.filter(item => item.id !== deleteId));
                    handleDeleteSucess({ response: shippingFeeRes });
                }
            case "variant":
                const variantRes = await axios.delete(route('productVariant.delete', deleteId));
                if (variantRes.status === 200) {
                    setInventory(curr=> curr.filter(item => item.id !== deleteId));
                    handleDeleteSucess({ response: variantRes });
                }
            default :
                return null;
        }
    };
  return (
    <div className='h-fit w-full max-w-md bg-white px-6 pt-12 pb-6 relative rounded-xl shadow-2xl'>
        <button className='absolute top-6 right-6 cursor-pointer' onClick={() => {
            setModal('');
            setDeleteId('');
            setDeleteType('');
        }}>
            <img src={CrossButtonIcon} alt="close button icon" className='h-6 w-6 object-contain' />
        </button>
        <h2 className='text-3xl font-semibold tracking-wide mb-3'>Do you want to delete this data ?</h2>
        <form onSubmit={handleSubmit(handleDelete)}>
            <button type='submit' className='text-lg h-11 w-full bordr rounded-sm bg-black text-white cursor-pointer'>
                Confirm Delete
            </button>
        </form>
    </div>
  )
}

export default ConfrimDelete