import BreadCrumb from '@/Components/products/ui/BreadCrumb'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import PlusIcon from '../../assests/icon/plus.png'
import ChangeStatusButton from '@/Components/products/ui/ChangeStatusButton'
import EditIcon from '../../assests/icon/edit.png'
import { Tooltip } from 'react-tooltip'
import DataContext from '@/Context/DataContext'
import DashboardLayout from '@/Layouts/DashboardLayout'
import Loader from '@/Components/products/ui/Loader'
import toast from 'react-hot-toast'
import axios from 'axios'
import { route } from 'ziggy-js'
import { flexRender, getCoreRowModel, getExpandedRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'

const Categories = () => {
    const { setModal, setUpdateData } = useContext(DataContext);
    const [ category, setCategory ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        async function fetchData(){
            setLoading(true);
            try {
                const response = await axios.get(route('category.show'));
                if(response.status === 200) {
                    toast.success(response.data.message);
                    setCategory(response.data.data);
                    console.log(response.data.data);
                }
            } catch (error) {
                toast.error("Something went wrong.")                
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const columns = useMemo(() => [
        { id: "expander", header: "", cell: ({ row }) => (
            <div className='flex items-center justify-center w-full'>
                {row.getCanExpand() ? (
                <button onClick={row.getToggleExpandedHandler()} >
                    {row.getIsExpanded() ? "▼" : "▶"}
                </button>
            ) : <span className='w-4 inline-block'></span>}
            </div>
        )},
        { header: 'S.N.', cell: ({ row }) => (
             <div style={{ paddingLeft: `${row.depth * 1.5}rem`}} className='flex items-center gap-2'>
                {row.depth > 0 && <span className="text-gray-400">└─</span>}
                <strong>{ row.index + 1 }</strong>
            </div>
        )},
        { accessorKey: 'title', header: 'Category Title', cell: ({ row, getValue}) => (
            <div style={{ paddingLeft: `${row.depth * 1.5}rem`}}>
                <span>{ getValue()}</span>
            </div>
        )},
        { accessorKey : 'parent', header: 'Parent Category', cell : ({ row }) => (
            <span>{ row.original.parent?.title }</span>
        )},
        { accessorKey: 'image_url', header: 'Image', cell : ({ getValue, row }) => (
            <img src={ getValue()} alt={ row.original.title } className='h-12 w-fit mx-auto object-cover rounded-sm' />
        )},
        { accessorKey: 'is_active', header: 'Status', cell : ({ getValue, row }) => (
            <ChangeStatusButton state={getValue()} id={row.original.id} />
        )},
        { header: 'Action', cell : ({ row }) => (
            <>
                <button onClick={() => {setUpdateData( row.original ); setModal("category")}} className='cursor-pointer' data-tooltip-id='cat-edit' data-tooltip-content='Edit' data-tooltip-place='right' >
                    <img src={EditIcon} alt="edit button icon" className='h-6 w-6 object-contain' />
                </button>
                <Tooltip id='cat-edit' />
            </>
        )}
    ], []);

    const table = useReactTable({
        data: category,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSubRows: (rows) => rows.children,
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            }
        },
        getExpandedRowModel: getExpandedRowModel(),
        getSubRows: (row) => row.children,
    });

    if(loading) return <Loader />;
  return (
    <div className='max-w-7xl ml-56 mt-32 py-6 px-6'>
        <BreadCrumb title='Category' />
        <div className='flex items-center justify-between w-full border-b pb-3 mb-10'>
            <div className='flex flex-col gap-1.5'>
                <h2 className='text-2xl font-semibold tracking-wider'>Categories</h2>
                <p className='text-lg tracking-wide'>Manage your product categories</p>
            </div>
            <button onClick={() => setModal('category')} className='h-11 w-fit px-4 flex items-center justify-center gap-3 cursor-pointer border rounded-sm text-lg'>
                <img src={PlusIcon} alt="add button icon" className='h-5 w-5 object-contain' />
                Add new cateogry
            </button>
        </div>
        <table className='w-full border-collapse'>
            <thead>
                { table.getHeaderGroups().map(hg => (
                    <tr key={hg.id} className='bg-gray-100'>
                        {hg.headers.map(header => (
                            <th key={header.id} className='px-4 py-2 text-left'>
                                { flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                { table.getRowModel().rows.map(row => (
                    <tr key={row.id} className='border-b hover:bg-gray-50'>
                        { row.getVisibleCells().map(cell => (
                            <td key={cell.id} className='px-4 py-2'>
                                { flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        <div className='flex gap-2 mt-6 justify-end items-center'>
            <span className='block ml-2 text-lg font-semibold tracking-wider'>Page { table.getState().pagination.pageIndex + 1 } of {table.getPageCount()}</span>
            <button onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()} className='text-lg font-bold tracking-wide border rounded cursor-pointer h-fit py-1 w-fit px-2 flex items-center justify-center' >
                {'<<'}
            </button>
            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className='text-lg font-bold tracking-wide border rounded cursor-pointer h-fit w-fit px-2 py-1 flex items-center justify-center' >
                {'<'}
            </button>
            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className='text-lg font-bold tracking-wide border rounded h-fit w-fit p-2 cursor-pointer px-2 py-1 flex items-center justify-center' >
                {'>'}
            </button>
            <button onClick={() => table.lastPage()} disabled={!table.getCanNextPage()} className='text-lg font-bold tracking-wide border rounded h-fit w-fit p-2 cursor-pointer px-2 py-1 flex items-center justify-center'>
                {'>>'}
            </button>
        </div>
    </div>
  )
}

export default Categories

Categories.layout = (page) => <DashboardLayout>{page}</DashboardLayout>