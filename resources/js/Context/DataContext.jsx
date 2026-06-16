import AttrbiuteModal from '@/Components/modal/AttrbiuteModal';
import AttributeValueModal from '@/Components/modal/AttributeValueModal';
import CategoryModal from '@/Components/modal/CategoryModal';
import ConfrimDelete from '@/Components/modal/ConfrimDelete';
import CouponModal from '@/Components/modal/CouponModal';
import ProductGalleryModal from '@/Components/modal/ProductGalleryModal';
import ProductModal from '@/Components/modal/ProductModal';
import ProductVariantModal from '@/Components/modal/ProductVariantModal';
import ShippinfFeeModal from '@/Components/modal/ShippinfFeeModal';
import Loader from '@/Components/products/ui/Loader';
import axios from 'axios';
import React, { createContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { route } from 'ziggy-js';

const DataContext = createContext();

export function ContextProvider ({ children }) {
    const [ modal, setModal ] =useState('');
    const modalRef = useRef(null);
    const modalMap = {
        category: <CategoryModal />,
        coupon: <CouponModal />,
        products: <ProductModal />,
        attribute: <AttrbiuteModal />,
        attribute_value : <AttributeValueModal />,
        delete_confirm : <ConfrimDelete />,
        gallery : <ProductGalleryModal />,
        shipping : <ShippinfFeeModal />,
        variant : <ProductVariantModal />,
    };
    const [ updateData, setUpdateData ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ category, setCategory ] = useState([]);
    const [ coupon, setCoupon ] = useState([]);
    const [ product, setProduct] = useState([]);
    const [ attribute, setAttribute ] = useState([]);
    const [ attributeValue, setAttributValue ] = useState([]);
    const [ deleteId, setDeleteId ] = useState('');
    const [ deleteType, setDeleteType ] = useState('');
    const [ productId, setProductId ] = useState('');
     const [ shippingFee, setShippingFee ] = useState([]);
      const [ inventory, setInventory ] = useState([]);

    useEffect(() => {
        if(modal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = '';
        }
    }, [modal]);

    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const resposne = await Promise.allSettled([
                    axios.get(route('category.index')),
                    axios.get(route('coupon.index')),
                    axios.get(route('product.index')),
                    axios.get(route('attribute.index')),
                    axios.get(route('attributeValue.index')),
                ]); 

                const [ categoryRes, couponRes, productRes, attributeRes, attrValueRe ] = resposne;

                if (categoryRes.status === 'fulfilled') setCategory(categoryRes.value.data.data);
                if ( couponRes.status === 'fulfilled') setCoupon(couponRes.value.data.data);
                if (productRes.status === 'fulfilled') setProduct(productRes.value.data.data);
                if ( attributeRes.status === 'fulfilled') setAttribute(attributeRes.value.data.data);
                if (attrValueRe.status === 'fulfilled') setAttributValue(attrValueRe.value.data.data);
                setIsLoading(false);

            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    if (isLoading ) {
        return (<Loader />);
    }
    return(
        <DataContext.Provider value={{ modal, setModal, updateData, setUpdateData, category, setCategory, coupon, setCoupon, product, setProduct,
            attribute, setAttribute, attributeValue, setAttributValue, deleteId, deleteType, setDeleteId, setDeleteType, productId, setProductId,
            shippingFee, setShippingFee, inventory, setInventory
         }}>
            <Toaster position='top-right' gutter={8} toastOptions={{
                duration:3000,
                removeDelay:500,
            }} />
            { children }
            {modal && modalMap[modal] && createPortal(
                <div ref={modalRef} className='fixed inset-0 bg-black/60 flex items-center justify-center z-99'>
                    { modalMap[modal] }
                </div>
            , document.body)}
        </DataContext.Provider>
    );
}
export default DataContext
