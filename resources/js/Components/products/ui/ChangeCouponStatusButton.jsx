import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

const ChangeCouponStatusButton = ({ state, id }) => {
    const [ status, setStatus ] = useState(state);
    
    const handleSubmit = async (event) => {
        event.preventDefault();

        const value = !status;
        const formData = new FormData();
        formData.append('is_active', value ? 1 : 0);
        try {
            const response = await axios.post(route('coupon.updateStatus', id), formData );
            if (response.status === 200) {
                toast.success(response.data.message);
                setStatus(response.data.data);
            }
       } catch (error) {
            console.log(error);
       }
    }
    
  return (
    <form onSubmit={(event) => handleSubmit(event)}>
        { status === true ? (
            <button type='submit' className='h-8 text-sm tracking-wide font-semibold w-fit px-2 rounded-sm cursor-pointer bg-white text-green-700 border border-green-700'>
                Active
            </button>
        ) : (
            <button type='submit' className='h-8 text-sm tracking-wide font-semibold w-fit px-2 rounded-sm cursor-pointer bg-white text-red-700 border border-red-700'>
                Inactive
            </button>
        )}
    </form>
  )
}

export default ChangeCouponStatusButton