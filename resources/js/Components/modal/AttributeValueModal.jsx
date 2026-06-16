import DataContext from '@/Context/DataContext';
import React, { useContext, useRef, useState } from 'react'
import CrossIcon from '../../../assests/icon/cross-button.png'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';
import { route } from 'ziggy-js';
import ImageUploadIcon from '../../../assests/icon/image-add.png';

const AttributeValueModal = () => {
    const { setModal, setUpdateData, updateData, attribute, setAttributValue } = useContext(DataContext);
    const { register, handleSubmit, reset, formState: {errors}, setValue } = useForm({
        defaultValues: {
            attribute_id : updateData?.attribute_id ?? '',
            value : updateData?.value ?? '',
            is_active : updateData?.is_active ?? true,
            meta : {
                hex_code : updateData?.meta.hex_code ?? '',
                swatch_image : updateData?.meta.swatch_image ?? null,
                sort_position : updateData?.meta.sort_position ?? '',
                equivalent_us : updateData?.meta.equivalent_us ?? '',
                equivalent_eu : updateData?.meta.equivalent_eu ?? '',
                equivalent_uk : updateData?.meta.equivalent_uk ?? '',
            },
        }
    });

    const [ selectedType, setSelectedType ] = useState(() => {
        if (!updateData) return '';
        const selected = attribute.find(item => item.id === updateData.attribute_id);
        return selected.type ?? '';
    });

    const [ isActive, setIsActive ] = useState(updateData?.is_active ?? false);

    const handleFormSubmitSuccess = (resposne) => {
        toast.success(resposne.data.message);
        reset();
        setModal('');
        setUpdateData(null);
        setAttributValue(resposne.data.data);
    };

    const onSubmit = async (data) => {
        const formdata = new FormData();
        formdata.append('attribute_id', data.attribute_id);
        formdata.append('value', data.value);
        formdata.append('is_active', data.is_active ? 1 : 0);

        if (data.meta) {
            Object.entries(data.meta).forEach(([key, value]) => {
                if (key === 'swatch_image') {
                    if (value instanceof File) {
                        formdata.append('meta[swatch_image]', value);
                    }
                } else if ( value !== null && value !== undefined && value !== '') {
                    formdata.append(`meta[${key}]`, value);
                }
            });
        }

        try {
            if (updateData) {
                const response = await axios.post(route('attributeValue.update', updateData.id), formdata);
                if (response.status === 200) {
                    handleFormSubmitSuccess(response);
                }
            } else {
                const response = await axios.post(route('attributeValue.create'), formdata);
                if (response.status === 200) {
                    handleFormSubmitSuccess(response);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className='bg-white w-full max-w-md h-fit py-6 relative rounded-xl shadow-xl'>
            <button className='absolute top-8 right-8 cursor-pointer' onClick={() => {
                setModal('');
                setUpdateData(null);
            }}>
                <img src={CrossIcon} alt="cross button icon" className='h-6 w-6 object-contain' />
            </button>
            <h2 className='text-2xl tracking-wide font-semibold leading-12 px-6'>{ updateData ? `Update ${updateData.value} details` : 'Add new attribute value'}</h2>
            <p className='text-gray-500 px-6'>Add the attribute value</p>
            <form className='mt-6 h-100 overflow-y-scroll px-6' onSubmit={handleSubmit(onSubmit)}>
                <div className='mb-6'>
                    <label htmlFor="attribute" className='text-lg block mb-2.5 font-semibold'>Select a attribute <span className='text-red-600'>*</span></label>
                    <select id="attribute" className={`h-11 w-full border rounded-md outline-none px-4 ${errors.attribute_id ? 'border-red-600' : 'border-black'}`}
                        {...register('attribute_id', { required : 'Field must not be empty.'} )} onChange={e => {
                            const selected = attribute.find(item => item.id === Number(e.target.value));
                            setSelectedType(selected.type ?? '');
                            reset({ meta : {
                                'hex_code' : '',
                                'swatch_image' : null,
                                'sort_position' : '',
                                'equivalent_us' : '',
                                'equivalent_uk' : '',
                                'equivalent_eu' : ''
                            }})
                        }}>
                        <option value="" hidden>-- Select a option --</option>
                        {attribute.map( item => (
                            <option key={`ATTR-${item.id}`} value={item.id}>{ item.name} </option>
                        ))}
                    </select>
                    { errors.attribute_id && <p className='text-sm text-red-600'>* {errors.attribute_id.message}</p>}
                </div>
                <div className='mb-6'>
                    <label htmlFor="value" className='block mb-2.5 text-lg font-semibold'>Enter attribute value <span className='text-red-600'>*</span></label>
                    <input type="text" id='value' className={`h-11 w-full border outline-none rounded-md px-4 ${errors.value ? 'border-red-600' : 'border-black'}`} placeholder='e.g. -'
                        {...register('value', { required: 'Field must not be empty'})} />
                    { errors.value && <p className='text-sm text-red-600'>* {errors.value.message}</p>}
                </div>
                { selectedType === "color_swatch" && <ColorMeta register={register} errors={errors.meta ?? {}} setValue={setValue} />}
                { selectedType === "select" && <SelectMeta register={register} errors={errors.meta ?? {}} />}
                <div className='mb-6'>
                    <fieldset className='px-4 py-4 border rounded-sm flex items-center gap-2 h-fit w-full'>
                        <legend className='text-lg font-semibold px-2'>Active status</legend>
                        <label className='text-lg font-medium tracking-wide'>Set attribute value active ?</label>
                        <div onClick={() => {
                            const current = !isActive;
                            setIsActive(curr => !curr); 
                            setValue('is_active', current);
                            }} className={`h-4 w-11 rounded-full overflow-hidden cursor-pointer flex items-center p-1 transition-colors duration-300 ease-in-out ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>
                        <div className={`h-3 w-3 rounded-full bg-white transition-all duration-300 ease-in-out ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                    </fieldset>
                </div>
                <button type='submit' className='h-11 w-full cursor-pointer bg-black text-white border rounded-md mb-6'>
                        { updateData ? 'Update attribute value' : 'Add attribute value'}
                </button>
                <p className='text-sm font-bold tracking-wide'>Note: Required field are marked <span className='text-md text-red-600'>*</span></p>
            </form>
        </div>
    )
}

export default AttributeValueModal


function ColorMeta ({ register, errors, setValue }) {
    const [ imagePrev, setImagePrev ] = useState(null);
    const include_types = ['image/png', 'image/jpg', 'image/jpeg', 'image/webp'];
    const max_size = 2;
    const imageRef = useRef(null);
    const handleImageChange = (e) => {
        e.preventDefault();
        const image = e.target.files[0];
        if (!include_types.includes(image.type)){
            toast.error("Only jpg, png, jpeg or webp files allowed.");
            return;
        }
        if(image.size > max_size * 1024 * 1024) {
            toast.error("Image should be less than or equal to 2MB.")
        }

        setImagePrev(URL.createObjectURL(image));
        setValue('meta.swatch_image', image);

    }
    return (
        <fieldset className='mb-6 flex flex-col gap-4 border rounded px-4 pt-3 pb-6'>
            <legend className='text-lg font-semibold tracking-wide px-2'>Color Input</legend>
            <div>
                <label htmlFor="meta_hex_code" className='mb-2 text-lg font-semibold tracking-wide block'>Enter color hex code</label>
                <input type="text" id='meta_hex_code' className={`h-11 w-full border rounded outline-none px-4 ${errors.hex_code ? 'border-red-600' : 'border-black'} `}
                    placeholder='e.g. #FF12A9' {...register('meta.hex_code', { pattern: {
                        value: /^#[0-9A-Fa-f]{6}$/,
                        message: 'Invalid hex code',
                    }})} />
                { errors.hex_code && <p className='text-sm text-red-600 mt-2'>*{ errors.hex_code.message}</p>}
            </div>
            <div>
                <label htmlFor="meta_swatch_image" className='mb-2 text-lg font-semibold tracking-wide block'>Choose a image</label>
                <div className='flex items-center gap-6'>
                    <button className='h-12 w-12 rounded border cursor-pointer flex items-center justify-center' type='button' onClick={() => imageRef.current.click()}>
                        <img src={ImageUploadIcon} alt="image upload icon" className='h-8 w-8 object-contain' />
                        <input type="file" accept='image/*' id='meta_swatch_image' className='hidden' ref={imageRef} onChange={e => handleImageChange(e)} max={1} />
                    </button>
                    { imagePrev && <img src={imagePrev} alt='image preview' className='h-12 w-fit object-cover rounded-md' />}
                </div>
            </div>
        </fieldset>
    );
}

function SelectMeta ({ register, errors }){
    return (
        <fieldset className='mb-6 flex flex-col gap-4 border rounded px-4 pt-3 pb-6'>
            <legend className='text-lg font-semibold tracking-wide px-2'>Size Input</legend>
            <div>
                <label htmlFor="meta_sort_position" className='text-lg mb-2 block font-semibold'>Enter size display order</label>
                <input type="number" min={0} max={9} id='meta_sort_position' className={`h-11 w-full outline-none px-4 rounded border ${errors.sort_position ? 'border-red-600' : 'border-black'}`}
                    {...register('meta.sort_position', { min: {
                        value : 0,
                        message : 'Minimum display order should be 0.'
                    }, max: {
                        value: 9,
                        message: 'Maximum display order shoulde be 9.'
                    }})} />
                { errors.sort_position && <p className='text-sm text-red-600 mt-2'>* {errors.sort_position.message}</p>}
            </div>
            <fieldset className='px-4 py-4 border rounded'>
                <legend className='text-lg font-semibold px-2'>Equivalent size</legend>
                <div className='grid grid-cols-3 gap-3'>
                    <div>
                        <label htmlFor="equivalent_us" className='text-lg mb-2 block font-semibold'>US</label>
                        <input type="text" id='equivalent_us' className='rounded border h-11 outline-none w-full px-2' {...register('meta.equivalent_us')} />
                    </div>
                    <div>
                        <label htmlFor="equivalent_eu" className='text-lg mb-2 block font-semibold'>EU</label>
                        <input type="number" id='equivalent_eu' className='rounded border h-11 outline-none w-full px-2' {...register('meta.equivalent_eu')} />
                    </div>
                    <div>
                        <label htmlFor="equivalent_uk" className='text-lg mb-2 block font-semibold'>UK</label>
                        <input type="number" id='equivalent_uk' className='rounded border h-11 outline-none w-full px-2' {...register('meta.equivalent_uk')} />
                    </div>
                </div>
            </fieldset>
        </fieldset>
    );
}
