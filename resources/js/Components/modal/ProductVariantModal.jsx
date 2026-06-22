import React, { useContext, useState } from 'react'
import CrossButtonIcon from '../../../assests/icon/cross-button.png'
import DataContext from '@/Context/DataContext'
import { useForm } from 'react-hook-form';
import DownButtonIcon from '../../../assests/icon/down-chevron.png'
import NextButtonIcon from '../../../assests/icon/next.png'
import { route } from 'ziggy-js';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductVariantModal = () => {
  const { setModal, setUpdateData, updateData, productId, setProductId, attribute, setInventory } = useContext(DataContext);
  const { handleSubmit, register, reset, formState: {errors} } = useForm({
    defaultValues: {
      sku : updateData?.sku ?? '',
      price_override : updateData?.price_override ?? 0,
      stock_qty : updateData?.stock_qty ?? 0,
      low_stock_threshold : updateData?.low_stock_threshold ?? 0,
      attribute_values : updateData?.attribute_values ?? [],
    }
  });

  const [ selectedAttribute, setSelectedAttribute ] = useState(updateData?.attribute_values ?? []);
  const [ dropdown, setDropDown ] = useState(false);
  const [ options, setOptions ] = useState('');

  const handleAttributeSelection = ({ id, value }) => {
    setSelectedAttribute(curr => {
      const selected = curr.find(i => i.id === id);
      if (selected) {
        return curr.filter(item => item.id !== id );
      } else {
        return [...curr, { id, value}];
      }

    })
  };

  const handleFormSubmitSuccess = (response) => {
      toast.success(response.data.message);
      reset();
      setProductId('');
      setUpdateData(null);
      setModal('');
      setInventory(response.data.data);
  };

  const onSubmit = async (data) => {
    
    const formdata = new FormData();
    formdata.append('product_id', productId);
    formdata.append('sku', data.sku);
    formdata.append('price_override', data.price_override);
    formdata.append('stock_qty', data.stock_qty);
    formdata.append('low_stock_threshold', data.low_stock_threshold);
    selectedAttribute.forEach(item => (
      formdata.append('attribute_values[]', item.id)
    ));

    try {
      if (updateData) {
        const response = await axios.post(route('productVariant.update', updateData.id), formdata);
        if (response.status === 200) {
            handleFormSubmitSuccess(response);
        }
      } else {
        const response = await axios.post(route('productVariant.create'), formdata);
        if (response.status === 200) {
          handleFormSubmitSuccess(response);
        }
      }     
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className='bg-white h-fit w-full max-w-lg px-6 py-8 rounded-xl shadow-2xl relative'>
        <button className='absolute cursor-pointer top-4 right-4' onClick={() => {
          setModal('');
          setUpdateData(null);
        }}>
          <img src={CrossButtonIcon} alt="cross button icon" className='h-6 w-6 object-contain' />
        </button>
        <h2 className='mb-6 text-3xl font-semibold tracking-wide'>
          { updateData ? 'Update product variant detail' : 'Add new product variant' }
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid grid-cols-2 gap-3 mb-6'>
            <div>
                <label htmlFor="sku" className='block mb-2.5 text-lg font-semibold tracking-wide'>Add product SKU</label>
                <input type="text" id='sku' className='h-11 w-full outline-none border rounded-md px-4'
                  {...register('sku')} placeholder='e.g. SKU-001-JKR, SKU-002-SHO' />
            </div>
            <div>
                <label htmlFor="price_override" className='block mb-2.5 text-lg font-semibold tracking-wide'>Add Variant Price <span className='text-red-600'>*</span></label>
                <input type="text" id='price_override' className={`h-11 w-full outline-none border rounded-md px-4 ${errors.price_override ? 'border-red-600' : 'border-black'}`}
                  {...register('price_override', { required : 'Field must not be empty', min : {
                    'value' : 0,
                    'message' : 'Minimum value should be at least 0.',
                  }, max : {
                    value : 999999.99,
                    message : 'Price should be less than or equal to 999999.99',
                  }})} />
                { errors.price_override && <p className='text-sm mt-2.5 text-red-600'>* {errors.price_override.message}</p>}
            </div>
          </div>
          <div className='mb-6 grid grid-cols-2 gap-3'>
            <div>
                <label htmlFor="stock_qty" className='block mb-2.5 text-lg font-semibold tracking-wide'>Add stock quantity <span className='text-red-600'>*</span></label>
                <input type="text" id='stock_qty' className={`h-11 outline-none border rounded-md px-4 w-full ${errors.stock_qty ? 'border-red-600' : 'border-black'}`}
                  {...register('stock_qty', { required : 'Field must not be empty.', min: {
                    value: 0,
                    message : 'Stock quantity should not be less than 0.'
                  }})}  />
                { errors.stock_qty && <p className='mt-2.5 text-sm text-red-600'>* {errors.stock_qty.message}</p>}
            </div>
            <div>
                <label htmlFor="low_stock_threshold" className='block mb-2.5 text-lg font-semibold tracking-wide'>Add low stock level <span className='text-red-600'>*</span></label>
                <input type="text" id='low_stock_threshold' className={`h-11 w-full outline-none border rounded-md px-4 ${errors.low_stock_threshold ? 'border-red-600' : 'border-black'}`}
                  {...register('low_stock_threshold', { required : "Field must not be empty"})} />
                { errors.low_stock_threshold && <p className='mt-2.5 text-sm text-red-600'>* {errors.low_stock_threshold.message}</p>}
            </div>
          </div>
            <div className='mb-6'>
                  <label htmlFor="attribute_value" className='block mb-2.5 text-lg font-semibold tracking-wide'>Add product attribute <span className='text-red-600'>*</span></label>
                  <div className='relative'>
                    <div onClick={() => {setDropDown(curr => !curr); setOptions('')}}  className='flex items-center justify-between w-full h-11 cursor-pointer border rounded-md px-4 group'>
                      <div className='flex flex-wrap gap-2'>
                        { selectedAttribute.length === 0 ? <p>-- Select product attribute -- </p> : selectedAttribute.map((item, index) => (
                          <div key={`SA-${index}`} className='text-sm flex justify-center items-center gap-1 w-fit px-2 py-1 rounded bg-black text-white cursor-poiter' onClick={() => handleAttributeSelection({ id:item.id, title:item.title})}>
                            { item.value }
                            <img src={CrossButtonIcon} alt="cross button icon" className='h-2 w-2 object-contain invert' />  
                          </div>
                        ))}
                      </div>
                    <img src={DownButtonIcon} alt="down button icon" className={`h-5 w-5 object-contain transform transition-transform duration-200 ease-in-out group-hover:rotate-180 ${dropdown ? 'rotate-180' : 'rotate-0'}`} />
                    </div>
                  { dropdown && 
                    <div className='absolute mt-1 top-full w-full rounded-md flex'>
                      <div className='w-1/2 bg-white rounded-md border flex flex-col overflow-hidden h-fit'>   
                      { attribute.map(item => (
                        <div key={`ATT-${item.id}`}  onClick={() => setOptions(curr => curr === item.id ? '' : item.id)} className='cursor-pointer py-2 px-4 hover:bg-gray-100 flex justify-between '>
                          <p>{ item.name }</p>
                          { item.attribute_value.length !== 0 && <button type='button' className='cursor-pointer'>
                              <img src={NextButtonIcon} alt='next button icon' className='h-4 w-4 object-contain' />
                            </button>}
                        </div>
                      ))}
                      </div>
                      {options && (
                        <div className='ml-1.5 w-1/2 bg-white rounded-md border flex flex-col self-start h-30 overflow-y-scroll'>
                          {  attribute.find(item => item.id === options)?.attribute_value.map(i => {
                            const selected = selectedAttribute.find(curr => curr.id === i.id);
                            return (<div type='button' className={`cursor-pointer py-2 px-4 ${ selected ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'} flex items-center justify-between`}
                                    onClick={() => {handleAttributeSelection({ id: i.id, value: i.value}); setDropDown(false);}} key={`ATT-VAL-${i.id}`}> 
                                {i.value} <img src={CrossButtonIcon} alt="close button icon" className={` ${selected ? 'block' : 'hidden'} invert h-3 w-3 object-contain`} /> </div>);
                          })}
                        </div>
                      )}
                    </div>
                  }
                </div>
            </div>
            <button className='h-11 w-full cursor-pointer rounded-md bg-black text-white text-lg border mb-6' >
                  { updateData ? 'Update product variant' : 'Add product variant'}
            </button>
            <p className='text-sm font-bold tracking-wide'>Note: required field are marked <span className='text-red-600'>*</span>. </p>
        </form>
    </div>
  )
}

export default ProductVariantModal