import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

const UserRegistrationForm = () => {
  const [ regPasswordType, setRegPasswordType ] = useState("password");
  const { register, handleSubmit, reset, resetField, formState: { errors }, watch, setError} = useForm({
    defaultValues: {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: null,
    }
  });
    const currPassword = watch('password');
  const onSubmit = async (data) => {
    try {
        const response = await axios.post(route('register'), data);
        if (response.status === 200) {
            toast.success("Account created successfully.");
            reset();
            console.log("success");
        }
    } catch (error) {
        if (error.response?.status === 422) {
            const errMsg = error.response.data.errors;
            Object.entries(errMsg).forEach(([field, message]) => (
                setError(field, { message: message[0]})
            ));
            resetField('password');
            resetField('password_confirmation');
        } else {
            toast.error("Something went wrong! Try again.");
            resetField('password');
            resetField('password_confirmation');
        }
    }
  };

  return (
     <div className='border-l p-10'>
        <h2 className='text-3xl font-bold mb-1.5 tracking-wide'>Sign up</h2>
        <p className='text-gray-400 text-lg tracking-wide mb-6'>Don't have a account ?<strong> Register now, </strong> to create your account.</p>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-4'>
                <label htmlFor="fName" className='block mb-1.5 text-gray-500 text-xl'>Full Name<span className='text-red-600'>*</span></label>
                <input type="text" id='fName' className={`outline-none border px-4 h-12 w-full rounded text-lg text-gray-500 ${ errors.name ? 'border-red-400' : 'border-gray-400'} `}
                placeholder='e.g. - Jhon Doe' {...register('name', { required: 'Full name is required.'})} />
                { errors.name && <p className='text-sm text-red-600 mt-1.5'>* {errors.name.message}</p>}
            </div>
            <div className='mb-4'>
                <label htmlFor="email" className='block mb-1.5 text-gray-500 text-xl'>E-mail address <span className='text-red-600'>*</span></label>
                <input type="email" id='email' className={`outline-none border px-4 h-12 w-full rounded text-lg text-gray-500 ${ errors.email ? 'border-red-400' : 'border-gray-400'} `}
                placeholder='example@example.com' {...register('email', { required: 'Email is required.', pattern: {
                    value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    message : 'Email doesot match.'
                }})} />
                { errors.email && <p className='text-sm mt-1.5 text-red-600'>* { errors.email.message}</p>}
            </div>
            <div className='mb-4'>
                <label htmlFor="password" className='block mb-1.5 text-gray-500 text-xl'>Password <span className='text-red-600'>*</span></label>
                <input type={regPasswordType} id='password' className={`outline-none border px-4 h-12 w-full rounded text-lg text-gray-500 ${ errors.password ? 'border-red-400' : 'border-gray-400'}`}
                placeholder='********' { ...register('password', { required: 'Password is required'})} />
                { errors.password && <p className='text-sm text-red-600 mt-1.5'>* {errors.password.message}</p>}
            </div>
            <div className='mb-4'>
                <label htmlFor="cPassword" className='block mb-1.5 text-gray-500 text-xl'>Confirm password <span className='text-red-600'>*</span></label>
                <input type={regPasswordType} id='cPassword' className={`outline-none border px-4 h-12 w-full rounded text-lg text-gray-500 ${ errors.password_confirmation ? 'border-red-400' : 'border-gray-400'}`}
                placeholder='********' {...register('password_confirmation', { required: 'Password confirmation is required.', validate: (value) => (
                    value === currPassword || "Passwrd do not match."
                ) })} />
                { errors.password_confirmation && <p className='mt-1.5 text-sm text-red-600'> * {errors.password_confirmation.message}</p>}
            </div>
            <div className='mb-4 flex justify-between'>
                <div>
                    <div className='flex gap-2 items-center h-6'>
                        <input type="checkbox" id='terms' className={`outline-none cursor-pointer border rounded ${ errors.terms ? 'border-red-400' : 'border-gray-400'}`} 
                            {...register('terms', { required : 'You must accept terms & conditions before registering.' })} />
                        <label htmlFor="terms" className='text-gray-500 font-semibold cursor-pointer'>I agree to <a className='underline text-blue-500'>Terms & Conditins.</a> <span className='text-red-600'>*</span> </label>
                    </div>
                    { errors.terms && <p className='text-xs text-red-600 mt-1.5'> * {errors.terms.message} </p>}
                </div>
                <button onClick={() => setRegPasswordType(curr => curr === "password" ? "text" : "password")} type='button' className='text-gray-500 font-semibold border-b cursor-pointer h-6 flex items-center pb-1 px-1'>
                    { regPasswordType === "password" ? "Show password" : "Hide password"}
                </button>
            </div>
            <button className='h-12 w-full border rounded cursor-pointer transition-all duration-300 ease-in-out bg-black text-white text-lg hover:invert'>
                Create my account
            </button>
        </form>
    </div>
  )
}

export default UserRegistrationForm