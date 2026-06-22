import BreadCrumb from '@/Components/products/ui/BreadCrumb'
import Loader from '@/Components/products/ui/Loader';
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { route } from 'ziggy-js';

const columns = [
    { header: 'S.N.', cell: ({ row }) => {
        return <strong>{ row.index + 1 }</strong>
    }},
    { accessorKey: 'order_id', header: 'Order Id'},
    { accessorKey: 'order_items', header: 'Product Name', cell : ({ row }) => (
        row.original.order_items.map(item => item.product_name).join(", ")
    )},
    { accessorKey: 'status', header: 'Status', cell: ({ getValue }) => {
        const setStatus = {
            pending : 'bg-yellow-500',
            confirmed : 'bg-green-500',
            processing : 'bg-blue-500',
            shipped : 'bg-green-700',
            delivered : 'bg-orange-500',
            cancelled : 'bg-red-500',
            returned : 'bg-red-700',
        };

        return <div className={`h-fit w-fit px-2.5 py-1.5 rounded border text-sm text-white ${setStatus[getValue()]}`}>
            <span>{ getValue() }</span>
        </div>
    }},
    { accessorKey: 'subtotal', header: 'Sub-Total', cell: ({ getValue }) => { return <strong>${getValue()}</strong>} },
    { accessorKey: 'discount_amount', header: 'Discount Amount', cell: ({ getValue }) => { return <strong>${getValue()}</strong>}},
    { accessorKey: 'shipping_fee', header: 'Shipping Fee', cell: ({ getValue }) => { return <strong>${getValue()}</strong>}},
    { accessorKey: 'total', header: 'Total', cell: ({ getValue }) => { return <strong>${getValue()}</strong>}},
    { id : 'actions', header: 'Action', cell: ({ row }) => {
        return (
            <div className='flex items-center justify-center gap-2'>
                <button onClick={() => console.log("edit", row.original.id)} className='border rounded text-xs px-2 py-1 h-fit w-fit cursor-pointer hover:bg-gray-100'>
                    Edit
                </button>
                <button onClick={() => console.log("delete", row.original.id)} className='border rounded text-xs px-2 py-1 h-fit w-fit cursor-pointer hover:bg-gray-100'>
                    Delete
                </button>
            </div>
        )
    }},
];

const Order = () => {
    const [ orders, setOrders ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const table = useReactTable({
        data: orders,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 3,
            }
        }
    });

    useEffect(() => {
        async function fetchData () {
            setLoading(true);
            try {
                const response = await axios.get(route('order.index'));
                if (response.status === 200) {
                    toast.success(response.data.message);
                    setOrders(response.data.data);
                }
            } catch (error) {
                if (error.response?.status === 422) {
                    toast.error("Something went wrong");
                } else {
                    toast.error("Network error! , Try again later.");
                }
            }

            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) return <Loader />;
  return (
    <div className='max-w-7xl ml-56 mt-32 px-6 py-6'>
        <BreadCrumb title="Order Details" />
        <table className='mt-6 w-full border-collapse'>
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

export default Order