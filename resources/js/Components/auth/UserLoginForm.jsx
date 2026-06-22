import React, { useState } from 'react'
import FacebookLogo from '../../../assests/icon/Facebook_Logo_Primary.png'
import GoogleLogo from '../../../assests/icon/Google_Symbol_1.png'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { route } from 'ziggy-js';

const UserLoginForm = () => {
    const [ passwordType, setPasswordType ] = useState("password");
    const { register, handleSubmit, reset, formState: { errors }, setError, resetField} = useForm({
        defaultValues: {
            email : '',
            password : '',
        }
    });

    const onSubmit = async ( data ) => {
        try {
            const response = await axios.post(route('login'), data);
            if (response.status === 200) {
                toast.success("Successfully logged in.");
                reset();
            }
        } catch (error) {
            if(error.response?.status === 422) {
                const errMsg = error.response.data.errors;
                Object.entries(errMsg).forEach(([field, message]) => (
                    setError(field, {message : message[0]})
                ))
                toast.error("Error message");
                resetField('password');
            } else {
                toast.error("Oops!, something went wrong.");
                resetField('password');
            }
        }
    };
  return (
    <div className='p-10'>
        <h2 className='text-3xl font-bold tracking-wide mb-2'>Sign in</h2>
        <p className='text-gray-400 text-lg tracking-wide mb-6'><strong>Welcome back!</strong> Please login to continue to your account</p>
        <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-5'>
            <label htmlFor="email" className='block mb-2 text-gray-500 text-xl'>Your e-mail <span className='text-red-600'>*</span></label>
            <input type="email" id='email' className={`outline-none border px-4 h-12 w-full rounded text-lg text-gray-500 ${errors.email ? 'border-red-400' : 'border-gray-400'}`}
            placeholder='example@example.com' { ...register('email', { required: 'Email is rqeuired', pattern : {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message : 'Email doesot match.'
            }})} />
            { errors.email && <p className='mt-2 text-sm text-red-600'>* {errors.email.message} </p>}
        </div>
        <div className='mb-10'>
            <label htmlFor="password" className='block mb-2 text-gray-500 text-xl'>Your password <span className='text-red-600'>*</span></label>
            <input type={passwordType} id='password' className={`outline-none border px-4 h-12 w-full rounded text-lg text-gray-500 ${errors.password ? 'border-red-400' : 'border-gray-400'}`}
            placeholder='********' {...register('password', { required: 'Password is required.'})} />
            { errors.password && <p className='mt-2 text-sm text-red-600'>* {errors.password.message} </p>}
            <div className='mt-3 flex justify-between'>
                <div className='flex gap-2 items-center h-6'>
                    <input type="checkbox" id='rember_me' className='outline-none cursor-pointer border rounded' />
                    <label htmlFor="rember_me" className='text-gray-500 font-semibold cursor-pointer'>Keep me logged in</label>
                </div>
                <button onClick={() => setPasswordType(curr => curr === "password" ? "text" : "password")} type='button' className='text-gray-500 font-semibold border-b cursor-pointer h-6 flex items-center pb-1 px-1'>
                { passwordType === "password" ? "Show password" : "Hide password"}
                </button>
            </div>
        </div>
        <button className='h-12 border rounded cursor-pointer w-full bg-black text-white transition-all duration-300 ease-in-out hover:invert text-lg font-semibold '>
                Sign in
        </button>
        </form>
        <p className='text-2xl text-center font-bold text-gray-400 my-4'>Or</p>
        <div className='flex items-center gap-2 justify-center w-full h-12 mb-5'>
            <button className='h-full flex-1 cursor-pointer rounded border flex items-center justify-center gap-3 text-sm font-semibold'>
            <img src={FacebookLogo} alt="fecebook logo" className='h-5 w-5 object-contain' /> Login with facebook
            </button>
            <button className='h-full flex-1 cursor-pointer rounded border flex items-center justify-center gap-3 text-sm font-semibold'>
            <img src={GoogleLogo} alt="google logo" className='h-5 w-5 object-contain' /> Login with Google
            </button>
        </div>
    </div>
  )
}

export default UserLoginForm