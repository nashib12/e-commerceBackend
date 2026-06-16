import React, { useContext, useState } from 'react'
import CrossIcon from '../../../assests/icon/cross-button.png';
import DataContext from '@/Context/DataContext';
import { FormProvider, useForm } from 'react-hook-form';
import axios from 'axios';
import { route } from 'ziggy-js';
import toast from 'react-hot-toast';
import { metaFieldsConfig } from '../attribute/FieldConfig';
import DynamicAttributeField from '../attribute/DynamicAttributeField';

const ATTRIBUTE_TYPE = [
    { id: 1, value : 'select', title: 'Select'},
    { id: 2, value : 'color_swatch', title: 'Color Swatch'},
    { id: 3, value : 'radio', title: 'Radio'},
    { id: 4, value : 'text', title: 'Text'},
    { id: 5, value : 'number', title: 'Number'},
    { id: 6, value : 'boolean', title: 'Boolean'},
]

const AttrbiuteModal = () => {
    const { setModal, setUpdateData, updateData, setAttribute } = useContext(DataContext);
    const methods = useForm({
        defaultValues: {
            name : updateData?.name ?? '',
            type : updateData?.type ?? '',
            is_active : updateData?.is_active ?? true,
            meta: {
                display_label: updateData?.meta.display_label ?? '',
                is_variant_forming: updateData?.meta.is_variant_forming ?? false,
                is_filterable: updateData?.meta.is_filterable ?? false,
                is_required: updateData?.meta.is_required ?? false,
                filter_display_type: updateData?.meta.filter_display_type ?? '',
                applicable_categories: updateData?.meta.applicable_categories ?? [],
                sort_order: updateData?.meta.sort_order ?? [],
                help_text: updateData?.meta.help_text ?? '',
                help_url: updateData?.meta.help_url ?? '',
                sku_key: updateData?.meta.sku_key ?? '',
            },
        }
    });

    const { register, formState: {errors}, handleSubmit, reset, setValue } = methods;

    const [ isActive, setIsActive ] = useState(updateData?.is_active ?? true);

    const handleFormSubmitSuccess = (response) => {
        toast.success(response.data.message);
        reset();
        setUpdateData(null);
        setModal('');
        setAttribute(response.data.data);
    };

    const onSubmit = async (data) => {
        try {
            if (updateData) {
                const response = await axios.post(route('attribute.update', updateData.id), data);
                if (response.status === 200) {
                    console.log("updated");
                    handleFormSubmitSuccess(response);
                }
            } else {
                const response = await axios.post(route('attribute.create'), data);
                if (response.status === 200) {
                    handleFormSubmitSuccess(response);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className='bg-white w-full max-w-md h-fit px-6 py-10 relative rounded-xl shadow-xl'>
        <button className='absolute top-8 right-8 cursor-pointer' onClick={() => {
            setModal('');
            setUpdateData(null);
        }}>
            <img src={CrossIcon} alt="cross button icon" className='h-6 w-6 object-contain' />
        </button>
        <h2 className='text-2xl tracking-wide font-semibold leading-12'>{ updateData ? `Update ${updateData.value} details` : 'Add new attribute'}</h2>
        <p className='text-gray-500'>Add the product attribute details</p>
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className='mt-6 h-80 overflow-y-scroll'>
                <div className='mb-6'>
                    <label htmlFor="name" className='block mb-2.5 text-lg font-semibold'>Enter attribute name <span className='text-red-600'>*</span> </label>
                    <input type="text" id='name' className={`h-11 w-full border outline-none px-4 rounded-sm ${errors.name ? 'border-red-600' : 'border-black'}`}
                        {...register('name', { required : 'Field must not empty'})} placeholder='e.g. - Size, Color, Brand' />
                    { errors.name && <p className='text-sm mt-2.5 text-red-600'>* {errors.name.message}</p>}
                </div>
                <div className='mb-6'>
                    <label htmlFor="type" className='block mb-2.5 text-lg font-semibold'>Select attribute type <span className='text-red-600'>*</span></label>
                    <select id='type' className={`h-11 w-full border outline-none px-4 rounded-sm ${errors.type ? 'border-red-600' : 'border-black'}`}
                        {...register('type', { required : 'Field must not empty'})} >
                        <option value="" hidden> -- Select a option --</option>
                        { ATTRIBUTE_TYPE.map(item => (
                            <option key={`ATTTYP-${item.id}`} value={item.value}>{ item.title}</option>
                        ))}
                    </select>
                    { errors.type && <p className='text-sm mt-2.5 text-red-600'>* {errors.type.message}</p>}
                </div>
                <div className='mb-6'>
                    <fieldset className='border rounded p-4 flex flex-col gap-4'>
                        <legend className='text-sm font-medium px-1'>Meta</legend>
                        {metaFieldsConfig.map(field => (
                            <DynamicAttributeField key={field.name} field={field} />
                        ))}
                    </fieldset>

                </div>
                <div className='mb-6 flex items-center gap-8'>
                    <label htmlFor="is_active" className='text-xl font-semibold'>Is this attribute active ?</label>
                    <div onClick={() => {
                        const current = !isActive;
                        setIsActive(curr => !curr); 
                        setValue('is_active', current);
                    }} className={`h-6 w-12 rounded-full overflow-hidden cursor-pointer flex items-center p-1 transition-colors duration-300 ease-in-out ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>
                        <div className={`h-4 w-4 rounded-full bg-white transition-all duration-300 ease-in-out ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </div>
                <button type='submit' className=' mb-6 h-11 w-full rounded-md border bg-black text-white text-lg font-semibold cursor-pointer'>
                    { updateData ? 'Update attribute detail' : 'Add attribute'}
                </button>
                <p className='text-sm font-bold tracking-wide'>Note: Required field are marked <span className='text-md text-red-600'>*</span></p>
            </form>
        </FormProvider>
    </div>
  )
}

export default AttrbiuteModal