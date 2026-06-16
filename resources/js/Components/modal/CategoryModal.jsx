import DataContext from '@/Context/DataContext'
import axios from 'axios';
import React, { useContext, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';
import ImageUploadIcon from '../../../assests/icon/image-upload.png'
import CrossButtonIcon from '../../../assests/icon/cross-button.png'
import NextButtonIcon from '../../../assests/icon/next.png'
import DownButtonIcon from '../../../assests/icon/down-chevron.png'

const MAX_SIZE = 2;
const INCLUDE_TYPE = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const CategoryModal = () => {
    const { setModal, updateData, category, setCategory, setUpdateData } = useContext(DataContext);
    const { register, handleSubmit, reset, formState:{errors}, setValue, setError } = useForm({ 
        defaultValues: {
            parent_id : updateData?.parent_id ?? '',
            title : updateData?.title ?? '',
            image : null,
        }
    });
    const imageRef = useRef(null);
    const [ imagePrev, setImagePrev ] = useState(updateData?.image_url ?? '');
    const [ parentCategory, setParentCategrory ] = useState(null);
    const [ childCategory, setChildCategory ] = useState([]);
    const [ dropdown, setDropdown ] = useState('');
    const [ selectedChildCategory, setSelectedChildCategory ] = useState(null);

    const handleImageChange = (event) => {
        event.preventDefault();
        const image = event.target.files[0];
      
        if (!INCLUDE_TYPE.includes(image.type)){
            return toast.error("Only jpg, png, jpeg or webp file type allowed.");
        }

        if (image.size > 2 * 1024 * 1024) {
            return toast.error("Image size must be equal to or less than 2MB.");
        }

        setImagePrev(URL.createObjectURL(image));
        setValue('image', image);
    };

    const handleFormSubmitSuccess = (response) => {
        toast.success(response.data.message);
        setModal('');
        reset();
        setCategory(response.data.data);
        setUpdateData(null);
        setParentCategrory(null);
        setChildCategory([]);
        setDropdown('');
        setSelectedChildCategory(null);
    }

    const onSubmit = async (data) => {
        const formdata = new FormData();
        if (selectedChildCategory) {
            formdata.append('parent_id', selectedChildCategory.id);
            formdata.append('title', selectedChildCategory.title);
        } else if (parentCategory) {
            formdata.append('parent_id', parentCategory.id);
            formdata.append('title', parentCategory.title);
        }
        formdata.append('title', data.title);
        
        if(data.image instanceof File) {
            formdata.append('image', data.image);
        }
        
        try {
            if (updateData) {
                const response = await axios.post(route('category.update', updateData.id), formdata);
                if (response.status === 200){
                    handleFormSubmitSuccess(response);
                }
            } else {
                const resposne = await axios.post(route('category.create'), formdata);
                if (resposne.status === 200) {
                    handleFormSubmitSuccess(resposne);
                }
            } 
        } catch (error) {
            if (error.response.status === 422) {
                const errors = error.response.data.errors;
                Object.entries(errors).forEach(([field, messages]) => {
                    setError(field, { message: messages[0]});
                })
            } else {
                console.log('Unexpected error', error);
            }
        }
    }
  return (
    <div className='h-fit w-full max-w-lg bg-white px-8 py-8 rounded-xl shadow-xl relative'>
        <button onClick={() => {
            setModal('');
            setUpdateData(null);
            setImagePrev('');
            setParentCategrory(null);
            setChildCategory([]);
            setDropdown('');
            setSelectedChildCategory(null);
            }} className='cursor-pointer absolute top-8 right-8'>
            <img src={CrossButtonIcon} alt="cross button icon" className='h-6 w-6 object-contain' />
        </button>
        <h2 className='text-3xl font-semibold tracking-wider leading-12'>{ updateData ? `Update ${updateData.title}'s details` : "Add new category"}</h2>
        <span className='text-gray-500'>Fill out the form to add the category item detail.</span>
        <form onSubmit={handleSubmit(onSubmit)} className='mt-6'>
            <div className='mb-6'>
                <label htmlFor="title" className='block mb-2.5 text-lg font-semibold'>Enter category title <span className='text-red-600'>*</span></label>
                <input type="text" id='title' className={`h-11 outline-none px-4 border rounded-md w-full transition-colors duration-300 ease-in-out ${ errors.title ? 'border-red-600' : 'border-black'}`}
                    placeholder='e.g. Jacket, Shoes, Bags' {...register('title', { required: 'Field must not be empty'})} />
                { errors.title && <p className='text-sm text-red-600 mt-2.5'>* {errors.title.message}</p>}
            </div>
            <div className='mb-6'>
                <label htmlFor="parentId" className='block mb-2.5 text-lg font-semibold'>Select parent category</label>
                <div className='h-11 w-full px-4 border rounded-md relative'>
                    <div onClick={() => setDropdown(cur => cur === 'parent' ? '' : 'parent')} className='flex items-center justify-between h-full w-full cursor-pointer'>
                        { parentCategory ? parentCategory.title : '-- Select a category --'}
                        <img src={DownButtonIcon} alt="down button icon" className='h-4 w-4 object- contain' />
                    </div>
                    { dropdown === 'parent' && <ul className='bg-white w-full shadow-2xl z-99 absolute top-full left-0 mt-1'>
                            { category.map(item => {
                                const hasParent = item.parent_id;
                                if ( !hasParent) {
                                //     return (<li key={`CAT-${item.id}`} onClick={(e) => { e.preventDefault(); setParentCategrory(item); setDropdown(''); setChildCategory([]); setSelectedChildCategory(null)}} className='px-4 py-2 cursor-pointer hover:bg-gray-100'>{ item.title}</li>)
                                // } else {
                                    return ( <li key={`CAT-${item.id}`} onClick={(e) => { e.preventDefault(); setDropdown(''); setChildCategory(item.children); setParentCategrory(item); setSelectedChildCategory(null);}} className='px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center justify-between'>
                                        { item.title } <img src={NextButtonIcon} alt='next button icon' className='h-4 w-4 object-contain' />
                                    </li>)
                                }
                            })}
                        </ul>}
                </div>
            </div>
            { childCategory.length !== 0 && 
                <div className='mb-6'>
                    <label className='mb-2.5 block text-lg font-semibold'>Select child category</label>
                    <div className='h-11 w-full px-4 border rounded-md relative'>
                        <div onClick={() => setDropdown(cur => cur === 'child' ? '' : 'child')} className='flex items-center justify-between h-full w-full cursor-pointer'>
                            { selectedChildCategory ? selectedChildCategory.title : '-- Select a sub category --'}
                            <img src={DownButtonIcon} alt="down button icon" className='h-4 w-4 object-contain' />
                        </div>
                        { dropdown === 'child' && ( <ul className='bg-white z-99 shadow-2xl absolute top-full mt-1 left-0 w-full'>
                            { childCategory.map(item => (
                                <li key={`SUB-CAT-${item.id}`} onClick={(e) => { e.preventDefault(); setDropdown(''); setSelectedChildCategory(item)}} className='cursor-pointer px-4 py-2 hover:bg-gray-100' >{ item.title }</li>
                            )) }
                        </ul>)}
                    </div>
                </div>
            }
            <div className='mb-6'>
                <label className='block mb-2.5 text-lg font-semibold'>Select a image</label>
                <div className='flex items-center gap-6'>
                    <button type='button' onClick={() => imageRef.current.click()} className='cursor-pointer h-24 w-24 border rounded-md flex items-center justify-center'>
                        <img src={ImageUploadIcon} alt="image upload icon" className='h-16 w-12 object-contain' />
                        <input type="file" ref={imageRef} className='hidden' onChange={(event) => handleImageChange(event)} max={1} accept='image/*' />
                    </button>
                    { imagePrev && <img src={imagePrev} alt='image preview' className='h-24 w-fit object-cover rounded-md shadow-xl' />}
                </div>
                <span className='text-gray-400 text-sm block mt-2.5'>Note: Only jpg, png, jpeg and webp files allowed. Image size must be equal to or less than 2MB.</span>
            </div>
           <button className='h-11 w-full mb-6 cursor-pointer bg-black text-white rounded-md text-lg font-semibold transition-colors duration-300 ease-in-out border hover:bg-white hover:text-black'>
            {updateData ? "Update category detail" : "Add new category"}
           </button>
        </form>
        <p className='text-sm font-semibold'>Note: Required field are marked <span className='text-red-600'>*</span></p>
    </div>
  )
}

export default CategoryModal