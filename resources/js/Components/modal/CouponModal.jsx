import DataContext from '@/Context/DataContext'
import React, { useContext } from 'react'
import CloseButtonIcon from '../../../assests/icon/cross-button.png'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { route } from 'ziggy-js'

const COUPON_TYPE = [
    { id: 1, type: 'Percentage', value: 'percentage'},
    { id: 2, type: 'Fixed', value: 'fixed'},
];
const CouponModal = () => {
    const today = new Date().toISOString().split('T')[0];
    const { setModal, setUpdateData, updateData, setCoupon } = useContext(DataContext)
    const formatDate = (dateString) => {
        if(!dateString) return;
        return new Date(dateString).toISOString().split('T')[0];
    }

    const { register, handleSubmit, setValue, reset, formState: {errors}, watch, setError } = useForm({
        defaultValues: {
            code : updateData?.code ?? '',
            type : updateData?.type ?? '',
            value : updateData?.value ?? '',
            min_order_amount : updateData?.min_order_amount ?? '',
            max_uses : updateData?.max_uses ?? '',
            expires_at : formatDate(updateData?.expires_at) ?? '',
        }
    });

    const type = watch('type');

    const handleFormSubmitSuccess = (response) => {
        toast.success(response.data.message);
        reset();
        setModal('');
        setUpdateData(null);
        setCoupon(response.data.data);
    };

    const onSubmit = async (data) => {
        try {
            if(updateData) {
                const response = await axios.post(route('coupon.update', updateData.id), data);
                if (response.status === 200) {
                    handleFormSubmitSuccess(response);
                }
            } else {
                const response = await axios.post(route('coupon.create'), data);
                if (response.status === 200) {
                    handleFormSubmitSuccess(response);
                }
            }
        } catch (error) {
            if(error.response.status === 422){
                const errors = error.response.data.errors;
                Object.entries(errors).forEach(([field, messages]) => {
                    setError(field, {message: messages[0]});
                });
             
            } else {
                console.log('Unexcpeted error', error);
            }
        }
    };
  return (
    <div className='bg-white w-full max-w-2xl px-6 py-6 rounded-xl shadow-xl h-fit relative'>
        <button className='absolute top-8 right-8 cursor-pointer' onClick={() => {
            setModal('');
            setUpdateData(null);
        }}>
            <img src={CloseButtonIcon} alt="Close button icon" className='h-6 w-6 object-contain' />
        </button>
        <h2 className='text-3xl tracking-wider font-semibold leading-12'>{ updateData ? `Update ${updateData.code}'s detail` : 'Add coupon detail'}</h2>
        <span className='text-gray-500'>Fill out the form to add coupon details.</span>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-6'>
            <div className='grid grid-cols-2 gap-6'>
                <div>
                    <div className='mb-6'>
                        <label htmlFor="code" className='block mb-2.5 text-lg font-semibold' >Enter coupon code <span className='text-red-600'>*</span></label>
                        <input type="text" id='code' className={`h-11 rounded-md w-full outline-none px-4 border ${errors.code ? 'border-red-600' : 'border-black'}`}
                            placeholder='e.g. - CODE-0123' {...register('code', { required: 'Field must not be empty.'})} />
                        { errors.code && <p className='text-sm mt-2.5 text-red-600'>* {errors.code.message} </p>}
                    </div>
                    <div className='mb-6'>
                        <label htmlFor="type" className='block mb-2.5 text-lg font-semibold'>Select coupon type <span className='text-red-600'>*</span></label>
                        <select id="type" className={`h-11 rounded-md w-full outline-none px-4 border ${errors.type ?'border-red-600' : 'border-black'}`}
                            {...register('type', { required : 'Coupon type is required'})}>
                                <option value="" hidden> -- Select a option --</option>
                                {COUPON_TYPE.map(item => (
                                    <option key={`COPT-${item.id}`} value={item.value}>{item.type}</option>
                                ))}
                        </select>
                        { errors.type && <p className='text-sm mt-2.5 text-red-600'>     * {errors.type.message}</p>}
                    </div>
                    <div className='mb-6'>
                        <label htmlFor="value" className='block mb-2.5 text-lg font-semibold'>Enter coupon value <span className='text-red-600'>*</span></label>
                        <input type="number" id="value" className={`h-11 w-full rounded-md outline-none px-4 border ${errors.value ? 'border-red-600' : 'border-black'}`}
                            placeholder='e.g. 12%, 15%, 1000' {...register('value', { required : 'Field must not be empty.'
                                , min : { value: 0, message: 'Value must be at least 0.'}, 
                                validate: (value) => {
                                    if ( type === 'percentage' && parseFloat(value) > 100) {
                                        return 'Percentage value cannot excedd 100.'
                                    } else {
                                        return true;
                                    }
                                }
                            })} />
                        { errors.value && <p className='text-sm text-red-600 mt-2.5'>* { errors.value.message}</p>}
                    </div>
                    <div className='mb-6'>
                        <label htmlFor="min_order" className='block mb-2.5 text-lg font-semibold'>Enter minimum order value <span className='text-red-600'>*</span></label>
                        <input type="text" id='min_order' className={`h-11 w-full rounded-md outline-none px-4 border ${ errors.min_order_amount ? 'border-red-600' : 'border-black'}`}
                            placeholder='e.g. 1500, 2000' {...register('min_order_amount', { required: 'Field must not be empty.'})} />
                        { errors.min_order_amount && <p className='text-sm text-red-600 mt-2.5'>* {errors.min_order_amount.message}</p>}
                    </div>
                </div>
                <div>
                    <div className='mb-6'>
                        <label htmlFor="max_uses" className='block mb-2.5 text-lg font-semibold'>Maximum use allowed <span className='text-red-600'>*</span></label>
                        <input type="text" id='max_uses' className={`h-11 w-full outline-none px-4 rounded-md border ${errors.max_uses ? 'border-red-600' : 'border-black'}`}
                            placeholder='e.g. - 10, 20' {...register('max_uses', { required: 'Field must not be empty.'})} />
                        { errors.max_uses && <p className='mt-2.5 text-sm text-red-600'> * { errors.max_uses.message}</p>}
                    </div>
                    <div className='mb-6'>
                        <label htmlFor="expires_at" className='block mb-2.5 text-lg font-semibold'>Expiery date <span className='text-red-600'>*</span></label>
                        <input min={today} type="date" className={`outline-none h-11 w-full border px-4 rounded-sm ${errors.expires_at ? 'border-red-600' : 'border-black'} `} 
                           {...register('expires_at', { required: 'Field must not be empty.'})} />
                        { errors.expires_at && <p className='text-sm text-red-600 mt-2.5'>* {errors.expires_at.message}</p>}
                    </div>
                    <button type='submit' className='mb-6 h-11 w-full border rounded-md bg-black text-white cursor-pointer transition-colors duration-300 ease-in-out hover:bg-white hover:text-black'>
                        {updateData ? 'Update coupon data' : 'Add new coupon'}
                    </button>
                    <p className='text-sm font-semibold'>Note: Required field are marked <span className='text-red-600'>*</span></p>
                </div>
            </div>
        </form>
    </div>
  )
}

export default CouponModal