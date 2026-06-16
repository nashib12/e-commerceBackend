import React, { useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

const DynamicAttributeField = ({ field }) => {
    const { register, control } = useFormContext();
    const { name, label, type, options, maxLength } = field;

    switch (type) {
        case 'text':
            return (
                <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium'>{ label }</label>
                    <input {...register(name)} maxLength={maxLength} className='border outline-none px-3 py-2 rounded' />
                </div>
            )
        case 'textarea': 
            return (
                <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium'>{ label }</label>
                    <textarea {...register(name)} maxLength={maxLength} rows={3} className='rounded border px-3 py-2 text-sm' />
                </div>
            )
        case 'checkbox':
            return (
                <div className='flex items-center gap-2'>
                    <input type="checkbox" {...register(name)} className='w-4 h-4' />
                    <label className='text-sm font-medium'>{ label }</label>
                </div>
            )
        case 'select':
            return (
                <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium'>{ label }</label>
                    <select {...register(name)} className='border px-3 py-3 rounded text-sm' >
                        <option value="">-- Select --</option>
                        { options.map(opt => (
                            <option key={opt} value={opt}>
                                {opt.replace(/_/g, '')}
                            </option>
                        ))}
                    </select>
                </div>
            )
        case 'tag_input':
            return <TagInput name={name} label={label} control={control} />; 
        default:
            return null;
    }
}

export default DynamicAttributeField

function TagInput({ name, label, control}) {
    const { fields, append, remove} = useFieldArray({ control, name});
    const [ inputVal, setInputVal] = useState('');

    const handleAdd = () => {
        if(inputVal.trim()) {
            append(inputVal.trim());
            setInputVal('');
        }
    };

    return (
        <div className='flex flex-col gap-1'>
            <label className='text-sm font-medium'> { label }</label>
            <div className='flex gap-2'>
                <input value={inputVal} onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())} 
                    className='border rounded px-3 py-2 text-sm flex-1' placeholder='Type and press enter' />
                <button type='button' onClick={handleAdd} className='px-3 py-2 bg-blue-600 text-white rounded text-sm'>Add</button>
            </div>
            <div className='flex flex-wrap gap-2 mt-1'>
                { fields.map(( field, index ) => (
                    <span key={field.id} className='flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 text-sm'>
                        { field.value }
                        <button className='text-red-600 font-bold' onClick={() => remove(index)}>×</button>
                    </span>
                ))}
            </div>
        </div>
    );
}