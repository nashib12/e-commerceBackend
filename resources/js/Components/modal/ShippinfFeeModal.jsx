import DataContext from '@/Context/DataContext'
import React, { useContext, useState } from 'react'
import { route } from 'ziggy-js';
import CloseIcon from '../../../assests/icon/cross-button.png'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';

const ShippinfFeeModal = () => {
    const { setModal, setUpdateData, updateData, setShippingFee } = useContext(DataContext);
    const { register, handleSubmit, reset,setValue, formState:{errors} } = useForm({
        defaultValues : {
            flat_rate_fee : updateData?.flat_rate_fee ?? '',
            free_shipping_threshold : updateData?.free_shipping_threshold ?? '',
            is_active : updateData?.is_active ?? false,
        }
    });

    const [ isActive, setIsActive ] = useState( updateData?.is_active ?? false);

    const handleFormSubmitSuccess = (response) => {
        toast.success(response.data.message);
        setUpdateData(null);
        setModal('');
        reset();
        setShippingFee(response.data.data);
    };

    const onSubmit = async (data) => {
        try {
            if (updateData) {
                const response = await axios.post(route('shippingFee.update',updateData.id), data);
                if ( response.status === 200) {
                    handleFormSubmitSuccess(response);
                }
            } else {
                const response = await axios.post(route('shippingFee.create'), data);
                if (response.status === 200){
                    handleFormSubmitSuccess(response);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className='h-fit max-w-md w-full bg-white rounded-xl shadow-2xl px-6 py-6 relative'>
        <button onClick={() => {
            setModal('');
            setUpdateData(null);
        }} className='cursor-pointer absolute top-4 right-4'>
            <img src={CloseIcon} alt="close button icon" className='h-6 w-6 object-contain' />
        </button>
        <h2 className='text-3xl tracking-wide font-semibold mb-6'>{ updateData ? 'Update shipping fee detail' : 'Add new shipping fee'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-6'>
                <label htmlFor="flat_rate_fee" className='block mb-2 text-lg tracking-wide font-semibold'>Enter sheeping fee <span className='text-red-600'>*</span> </label>
                <input min={0} max={999999.99} type="number" id='flat_rate_fee' className={`h-11 w-full outline-none border rounded px-4 ${errors.flat_rate_fee ? 'border-red-600' : 'border-black'} `}
                    {...register('flat_rate_fee', { required : 'Field cannot be empty', min: {
                        value : 0,
                        message : 'Shipping cannot be less than 0.'
                    }, max : {
                        value : 999999.99,
                        message : 'Shipping fee cannot be more than 999999.99'
                    }})} />
                { errors.flat_rate_fee && <p className='text-sm text-red-600 mt-2'>* {errors.flat_rate_fee.message}</p>}
            </div>
            <div className='mb-6'>
                <label htmlFor="free_shipping_threshold" className='text-lg font-semibold block mb-2'>Enter minimum balance for free shipping <span className='text-red-600'>*</span></label>
                <input min={0} type="number" id='free_shipping_threshold' className={`h-11 px-4 w-full outline-none border rounded ${errors.free_shipping_threshold ? 'border-red-600' : 'border-black'}`} 
                    {...register('free_shipping_threshold', { required: 'Field cannot be empty', min : {
                        value: 0,
                        message: 'Free shipping amount cannot e less thah 0'
                    }})} />
                { errors.free_shipping_threshold && <p className='text-red-600 mt-2 text-sm'> * {errors.free_shipping_threshold.message }</p>}
            </div>
            <fieldset className='border h-fit w-full flex items-center gap-6 px-4 py-4 rounded mb-6'>
                    <legend className='text-lg font-semibold tracking-wide px-2'>Active Status</legend>
                    <label className='text-lg font-semibold'>Is the shipping fee active ?</label>
                    <button onClick={() => {
                        const current = !isActive;
                        setIsActive(curr => !curr);
                        setValue('is_active', current);
                    }} className={`h-fit flex shrink-0 w-12 py-1 px-0.5 rounded-full transition-colors duration-200 ease-in-out overflow-hidden ${isActive ? 'bg-blue-600' : 'bg-gray-600'} cursor-pointer `} type='button'>
                        <div className={`inline-flex rounded-full h-3 w-3 transform transition-transform duration-200 ease-in-out ${ isActive ? 'translate-x-7' : 'translate-x-1'} bg-white`} />
                    </button>
            </fieldset>
            <button type='submit' className='cursor-pointer h-11 w-full rounded border bg-black text-white text-lg mb-6'>
                    { updateData ? 'Update shipping fee' : 'Add shipping fee'}
            </button>
            <p className='font-bold tracking-wide text-sm'>Note: required field are marked <span className='text-red-600'>*</span></p>
        </form>
    </div>
  )
}

export default ShippinfFeeModal