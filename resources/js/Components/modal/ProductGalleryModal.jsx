import React, { useContext, useRef, useState } from 'react'
import CrossButtonIcon from '../../../assests/icon/cross-button.png'
import DataContext from '@/Context/DataContext'
import { useForm } from 'react-hook-form';
import ImageUploadIcon from '../../../assests/icon/image-upload.png'
import { Tooltip } from 'react-tooltip';
import toast from 'react-hot-toast';
import axios from 'axios';
import { route } from 'ziggy-js';

const INCLUDE_TYPES = ['image/png', 'image/jpg', 'image/webp', 'image/jpeg'];
const MAX_SIZE = 2;

const ProductGalleryModal = () => {
    const { setModal, productId, setProductId  } = useContext(DataContext);
    const [ images, setImages] = useState([]);
    const [ imagePreview, setImagePreview ] = useState([]);
    const imageRef = useRef(null);
    const { handleSubmit, register, reset } = useForm({
        defaultValues: {
            images : [],
            primary_image_index : '',
        }
    });

    const handleImageChange = (event) => {
        event.preventDefault();
        const files = Array.from(event.target.files);
        const imageUrls = files.map(item => 
            URL.createObjectURL(item)
        );

        if (!files) return;
        let count = 0;

        while (count < files.length) {
            if (!INCLUDE_TYPES.includes(files[count].type)){
                toast.error('Only jpg, png, jpeg and webp file allowed.');
                return
            }
            
            if (files[count].size > MAX_SIZE * 1024 * 1024) {
                toast.error('Image size should be less than or equal to 2MB.');
                return;
            }
            
            count++;
        }
        setImagePreview(imageUrls);
        setImages(files);
    };

    const handleImageRemove = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreview(prev => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data) => {
        if (images.length === 0) {
            toast.error("Select at least one image");
            return;
        }

        const formdata = new FormData();
        images.forEach(item => {
            formdata.append('images[]', item)
        });
        formdata.append('primary_image_index', data.primary_image_index);

        try {
            const response = await axios.post(route('image.store', productId), formdata);
            if (response.status === 200){
                toast.success(response.data.message);
                reset();
                setModal('');
                setProductId('');
            }
        } catch (error) {
            console.log(error);
        }
    };

  return (
    <div className='h-fit w-full max-w-xl bg-white px-6 py-8 relative rounded-xl shadow-2xl'>
        <button className='cursor-pointer absolute top-6 right-6' onClick={() => {
            setModal('');
            setProductId('');
        }}>
            <img src={CrossButtonIcon} alt="close button icon" className='h-6 w-6 object-contain' />
        </button>
        <h2 className='text-3xl mb-6 font-semibold tracking-wide'>
            Add product images
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div onClick={() => imageRef.current.click()} className='h-fit py-6 px-6 w-full cursor-pointer border-2 border-dashed rounded-md flex flex-col gap-2.5 items-center justify-center'>
                <img src={ImageUploadIcon} alt="image upload icon" className='h-24 w-fit object-contain' />
                <input type="file" accept='image/*' multiple className='hidden' ref={imageRef} onChange={handleImageChange} />
                <span className='text-gray-500 font-semibold'>Click to upload images</span>
                <p className='font-semibold text-xs tracking-wider'>Note:Only jpg, png, jpeg or webp files allowed. Must be less than or equal to 2MB.</p>
            </div>
            <div className={`flex flex-wrap gap-4 mt-6 px-2 transition-all duration-300 ease-in-out ${ imagePreview.length !== 0 ? 'h-60 overflow-y-scroll' : 'h-0'}`}>
                { imagePreview && imagePreview.map((item, index) => (
                    <div key={index + 1 } className='h-38 w-40 px-2 pt-4 pb-2 rounded-md cursor-pointer relative transition-all duration-300 ease-in-out hover:border-2 bg-white group flex items-end'>
                        <button type='button' onClick={() => handleImageRemove(index)} data-tooltip-id='remove-img' data-tooltip-content='Remove this image' data-tooltip-place='top' className='cursor-pointer hidden group-hover:flex bg-white 
                            transition-colors duration-300 ease-in-out hover:invert items-center justify-center h-6 w-6 rounded-full absolute top-1 right-2 border'>
                            <img src={CrossButtonIcon} alt="cross button icon" className='h-4 w-4 object-contain' />
                            <Tooltip id='remove-img' />
                        </button>
                        <img src={item} alt="image" className='h-26 w-full object-cover rounded-sm' />
                    </div>
                ))}
            </div>
            <div className='mt-6'>
                <label htmlFor="primary_index" className='block mb-2.5 text-lg font-semibold tracking-wide'>Select a primary index</label>
                <select id="primary_index" className='w-full h-12 rounded-md outline-none px-4 text-lg' {...register('primary_image_index')}>
                    <option value="" hidden>-- Select a option --</option>
                    { images.map((_, index) => (
                        <option value={index} key={`PRIMG-${index}`}>{ index + 1}</option>
                    ))}
                </select>
            </div>
            <button type='submit' className='w-full mt-6 h-12 cursor-pointer border rounded-md text-lg bg-black text-white'>
                Add product image
            </button>
        </form>
    </div>
  )
}

export default ProductGalleryModal