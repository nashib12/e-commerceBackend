import React, { useContext, useEffect, useState } from 'react'
import CloseIcon from '../../../assests/icon/cross-button.png'
import DataContext from '@/Context/DataContext';
import { useForm } from 'react-hook-form';
import QuillEditor from '../QuillEditor';
import axios from 'axios';
import { route } from 'ziggy-js';
import toast from 'react-hot-toast';

const ProductModal = () => {
    const { setModal, setUpdateData, updateData, category, setProduct } = useContext(DataContext);
    const [isFeatured, setIsFeatured] = useState(updateData?.is_featured ?? false);
    const { register, setValue, handleSubmit, setError, reset, formState: {errors}, watch } = useForm({
        defaultValues : {
            category_id : '',
            name : updateData?.name ?? '',
            description : updateData?.description ?? '',
            base_price : updateData?.base_price ?? '',
            sale_price : updateData?.sale_price ?? '',
            is_featured : updateData?.is_featured ?? false,
            parent_category_id : '',
            chld_category_id : '',
        }
    });
    
    const [ subCategory, setSubCategory ] = useState([]);
    const [ childCategory, setChildCategory ] = useState([]);
    const [ parentCategory, setParentCategory ] = useState(category.filter(item => item.parent_id === null));
    const selectedParent = watch('parent_category_id');
    const selectedChild = watch('chld_category_id');
    const [ ready, setReady ] = useState( updateData ? false : true);

    useEffect(() => {
        if (!updateData) return;

        const { parent_category_id, chld_category_id, category_id } = resolveParentChain(category, updateData.category_id);
        
        setChildCategory(category.filter(item => item.parent_id === parent_category_id));
        setSubCategory(category.filter(item => item.parent_id === chld_category_id));

        setValue('parent_category_id', parent_category_id);
        setValue('chld_category_id', chld_category_id);
        setValue('category_id', category_id);

        setReady(true);
    }, [category, updateData]);

    useEffect(() => {
        if(!ready) return;
        if (!selectedParent){
            setChildCategory([]);
            setSubCategory([]);
            setValue('chld_category_id', '');
            setValue('category_id');
            return;
        }

        const children = category.filter((item) => item.parent_id === Number(selectedParent));
        setChildCategory(children);
        setSubCategory([]);
        setValue('chld_category_id', '');
        setValue('category_id', '');
    }, [selectedParent, category]);

    useEffect(() => {
        if(!ready) return;
        if(!selectedChild) {
            setSubCategory([]);
            setValue('category_id', '');
            return;
        }

        const children = category.filter((item) => item.parent_id === Number(selectedChild));
        setSubCategory(children);
        setValue('category_id', '');
    }, [selectedChild, category]);
    
    const handleFormSubmitSuccess = (response) => {
        reset();
        setModal('');
        setUpdateData(null);
        toast.success(response.data.message);
        setProduct(response.data.data);
    };

    const onSubmit = async (data) => {
        const formdata = new FormData();
        formdata.append('category_id', data.category_id);
        formdata.append('name', data.name);
        formdata.append('description', data.description);
        formdata.append('base_price', data.base_price);
        formdata.append('sale_price', data.sale_price);
        formdata.append('is_featured', data.is_featured ? 1 : 0);

        try {
            if (updateData) {
                const response = await axios.post(route('product.update', updateData.id), formdata);
                if (response.status === 200) {
                    handleFormSubmitSuccess(response);
                }

            } else {
                const response = await axios.post(route('product.create'), formdata);
                if (response.status === 200){
                    handleFormSubmitSuccess(response);
                }
            }
            
        } catch (error) {
            if (error.response?.status === 422) {
                const errors = error.response.data.errors;
                Object.entries(errors).forEach(([field, messages]) => {
                    setError(field, { message: messages[0]});
                })
            } else {
                console.log('Uncaught error', error);
            }
        }
    }

  return (
    <div className='h-fit max-w-lg w-full py-10 rounded-xl shadow-xl bg-white relative'>
        <button onClick={() => {
            setModal('');
            setUpdateData(null);
            setChildCategory([]);
            setSubCategory([]);
            setParentCategory([]);
        }} className='absolute top-8 right-8 cursor-pointer'>
            <img src={CloseIcon} alt="close button icon" className='h-8 w-8 object-contain' />
        </button>
        <div className='px-6'>
            <h2 className='text-2xl font-semibold tracking-wider leading-12'>{ updateData ? `Update ${updateData.name}'s detail` : 'Add new Product'}</h2>
            <span className='text-gray-500'>Fill out the form to add product details</span>
        </div>
        
        <form className='mt-6 overflow-y-scroll h-120 px-6' onSubmit={handleSubmit(onSubmit)}>
            <div className='mb-6'>
                <label htmlFor="name" className='block mb-2.5 text-lg font-semibold'>Enter Product name: <span className='text-red-600'>*</span></label>
                <input type="text" id='name' placeholder='e.g.- Black shoes, Summer jacket' className={`h-11 w-full border outline-none px-4 rounded-md ${errors.name ? 'border-red-600' : 'border-black'}`}
                    {...register('name', { required: 'Enter the product name'})} />
                { errors.name && <p className='mt-2.5 text-sm text-red-600'>* {errors.name.message}</p>}
            </div>
            <div className='mb-6' >
                <label htmlFor="parent_category_id" className='block mb-2.5 text-lg font-semibold'>Select parent category <span className='text-red-600'>*</span> </label>
                <select id="parent_category_id" className={`h-11 w-full px-4 outline-none border rounded-md cursor-pointer ${ errors.parent_category_id ? 'border-red-600' : 'border-black'}`} 
                {...register('parent_category_id', { required : 'Category id is required.'})}>
                    <option value="" hidden>-- Select a option --</option>
                    { parentCategory.map(item => (
                        <option key={`cat-par-${item.id}`} value={item.id} >{item.title}</option>
                    ))}
                </select>
                { errors.parent_category_id && <p className='text-sm mt-2.5 text-red-600'> * {errors.parent_category_id.message}</p>}
            </div>
            <div className='grid grid-cols-2 gap-2'>
                { childCategory.length > 0 && (
                    <div className='mb-6'>
                        <label htmlFor="child_category_id" className='block mb-2.5 text-lg font-semibold'>Select child category <span className='text-red-600'>*</span></label>
                        <select id="child_category_id" {...register('chld_category_id', { required: "Select child category."})} className={`h-11 w-full outline-none border rounded-md px-4 ${errors.chld_category_id ? 'border-red-600' : 'border-black'}`} >
                            <option value="" hidden>-- Select a option --</option>
                            { childCategory.map(item => {
                               return <option key={`cat-chi${item.id}`} value={item.id}>{ item.title }</option>
                            })}
                        </select>
                        { errors.chld_category_id && <p className='text-sm mt-2.5 text-red-600'>* {errors.chld_category_id.message}</p>}
                    </div>
                )}
                { subCategory.length > 0 && (
                    <div className='mb-6'>
                        <label htmlFor="category_id" className='block mb-2.5 text-lg font-semibold'>Select a category <span className='text-red-600'>*</span></label>
                        <select id="category_id" {...register('category_id', { required: 'Category id is required'})} className={`h-11 w-full outline-none border rounded-md px-4 ${errors.category_id ? 'border-red-600' : 'border-black'}`}>
                            <option value="" hidden>-- Select a option --</option>
                            { subCategory.map(item => (
                                <option key={`cat-${item.id}`} value={item.id}>{ item.title}</option>
                            ))}
                        </select>
                        { errors.category_id && <p className='text-sm mt-2.5 text-red-600'>* {errors.category_id.message}</p>}
                    </div>
                )}
            </div>
            <div className='mb-6 h-50'>
                <label className='block mb-2.5 text-lg font-semibold'>Enter product description <span className='text-red-600'>*</span></label>
                <QuillEditor value={updateData?.description ?? ''} onChange={(html) => {
                    return setValue('description', html);
                }} placeholderText="Enter product details..." />
            </div>
            <div className='grid grid-cols-2 mb-6 gap-3'>
                <div>
                    <label htmlFor="base_price" className='block mb-2.5 text-lg font-semibold'>Enter base price <span className='text-red-600'>*</span> </label>
                    <input type="text" id='base_price' className={`h-11 w-full outline-none border rounded-md px-2 ${errors.base_price ? 'border-red-600' : 'border-black'}`}
                    {...register('base_price', { required: 'Field must not be empty.'})} />
                    { errors.base_price && <p className='text-sm mt-2.5 text-red-600'>* {errors.base_price.message}</p>}
                </div>
                <div>
                    <label htmlFor="sale_price" className='block mb-2.5 text-lg font-semibold'>Enter discount (%) </label>
                    <input type="number" min={0} max={100} id='sale_price' className='h-11 w-full outline-none border rounded-md px-2'
                    {...register('sale_price', { min : { value: 0, message: 'Sale percentage cannot be less than 0'}, max : { value: 100, message : "Sales percentage cannot exceed 100."}})} />
                </div>
            </div>
            <div className='flex items-center gap-8 mb-6'>
                <label htmlFor="is_featured" className='text-lg font-semibold'>Is the product featured ? </label>
                <div onClick={() => {
                    const current = !isFeatured;
                    setIsFeatured(curr => !curr); 
                    setValue('is_featured', current);
                }} className={`h-6 w-12 rounded-full overflow-hidden cursor-pointer flex items-center p-1 transition-colors duration-300 ease-in-out ${isFeatured ? 'bg-blue-500' : 'bg-gray-500'}`}>
                    <div className={`h-4 w-4 rounded-full bg-white transition-all duration-300 ease-in-out ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            </div>
            <button type='submit' className='h-11 w-full border cursor-pointer rounded-md bg-black text-white text-lg mb-3'>
                { updateData ? 'Update product Detail' : 'Add new product'}
            </button>
            <p className='text-sm font-semibold tracking-wide'>Note required field are marked: <span className='text-red-600 text-md'>*</span></p>
        </form>
    </div>
  )
}

export default ProductModal

function resolveParentChain( category, categoryId) {
    const sub = category.find(curr => curr.id === categoryId);
    const child = category.find(curr => curr.id === sub?.parent_id);
    const parent = category.find(curr => curr.id === child?.parent_id );

    return {
        parent_category_id : parent?.id ?? '',
        chld_category_id : child?.id ?? '',
        category_id : sub?.id ?? '',
    }
}