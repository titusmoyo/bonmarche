
import { CART_PAGE_INDEX } from '@utils/constants/layout_constants';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/auth';
import Layout from '@components/layout/layout';
import { useEffect } from 'react';
import { saveNodePathWithBoolean } from '@lib/firebase_db/firebase_writes';
import { getDatabase, ref, onValue} from "firebase/database";
import {initFirebase} from "@lib/firebase_db/firebase_init";
import { REALTIME_DATABASE_DB_PRODUCT_LIST, REALTIME_DATABASE_DB_TRENDING_LIST } from '@utils/constants/db_constants';
import { REALTIME_DATABASE_DB_CART_PRODUCTS } from '@utils/constants/db_constants';
import { getProductUsingSlug } from '@lib/firebase_db/firebase_read';
import { PRODUCTMODEL } from '@models/model';
import Link from 'next/link';
import { deletePathFromFbDb } from '@lib/firebase_db/firebase_writes';

const CartPage =()=>{
    const router = useRouter();
    const {user,dbuser} = useAuth();

    const [ cartProducts, setCartProducts ] = useState<PRODUCTMODEL[]>([]);

    const [ proda,setProda ] = useState<Record<string,PRODUCTMODEL>>({});

    if (!user && typeof window !== 'undefined') {
        //router.push('/auth/login');
        //return;
    }

    if (!user) {
        //router.push('/auth/login');
    }

    useEffect(() => {
        // listening for changes in product cart
        // console.log(user);
         (async () => {
             if(user){
                 initFirebase();
                 const db = getDatabase();
                 const cartProdRef = ref(db,REALTIME_DATABASE_DB_CART_PRODUCTS+user['uid']+'/');

                 onValue(cartProdRef, (snapshot) => {
                   //console.log(data);
                   const data = snapshot.val();
                   console.log(data);

                   if(data){
                       let tempList:PRODUCTMODEL[]=[];
                       Object.keys(data).forEach(async key => {
                         let prodId= key; // key1, key2, key3
                         let isProductInCart = data[key]; // value1, value2, value3
                         if(isProductInCart){
                             console.log("prod:::"+prodId);
                             let path = REALTIME_DATABASE_DB_PRODUCT_LIST+prodId;
                             let currentProduct:PRODUCTMODEL = await getProductUsingSlug(path);
                             //tempList.push(currentProduct);
                             //setCartProducts((prevState) => (tempList));
                             setProda((prevState: any) => ({...prevState,[prodId]:currentProduct}));
                         }
                       });

                       // updating the state
                       //setCartProducts(tempList);
                       //console.log("madhodha : "+tempList.length);
                       //console.log(tempList);
                       //setCartProducts((prevState: any) => (tempList));
                       //setCartProducts((prevState) => (tempList));

                   }//end of if
                 });
             }
         })();

    }, [user]);


    const getTheTotalPrice=():number=>{
        let total=0;
        Object.keys(proda).map((key) => {
            let product:PRODUCTMODEL=proda[key];
            total=total+product.price;
        });

        return total;
    }


    /* Removes a product from the cart */
    const removeProductFromCart=(selectedProduct:PRODUCTMODEL)=>{
        if(dbuser===null){
            //console.log("user is null");
            return;
        }

        const removeProduct = confirm(
          'Are you sure you want to remove this product from the Cart?',
        );
        if (removeProduct) {
            let path:string = REALTIME_DATABASE_DB_CART_PRODUCTS+dbuser['uid']+"/"+selectedProduct.productId;
            deletePathFromFbDb(path);

            delete proda[selectedProduct.productId];
            setProda(proda);
        }
    }

    return(
        <Layout  childType={CART_PAGE_INDEX}>
            {/* Shopping Cart */}
            <div className="mt-4 mb-[140px]">

                <h3 className="font-bold">Shopping Cart</h3>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-5 gap-2">

                    {/**/}
                    {/* left : List of cart items*/}
                    <div className="md:col-span-4">
                        <div className="grid md:grid-cols-2 gap-3">
                            {Object.keys(proda).map((key) => {
                                let product:PRODUCTMODEL=proda[key];
                                //console.log(proda[key]);
                                return(
                                    <div key={product.productId} className="border rounded-lg p-2 overflow-hidden">

                                        <Link href={`/product/${product.productId}`}>
                                            <div className="group cursor-pointer flex flex-col items-center justify-center">
                                                    <img
                                                         src={product.mainImageUrl}
                                                         alt={product.productName}
                                                         className="h-60 w-auto object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
                                                       />
                                                    <p>{product.productName}</p>
                                            </div>
                                        </Link>

                                        <div  className="flex items-center">

                                          <div className="flex-1 flex items-center space-x-2">
                                            <p className="text-lg font-bold">{product.price}</p>
                                            <span className="text-[10px]">{product.currency}</span>
                                          </div>


                                          {/* add to cart button*/}
                                          <div
                                            onClick={()=>{removeProductFromCart(product)}}
                                            className={`bg-slate-100 hover:cursor-pointer flex items-center justify-center rounded-md p-1 text-white`}>
                                            <svg className="w-6 h-6 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            <div className="text-sm md:text-base text-slate-800">Remove</div>
                                          </div>
                                          {/* End of cart */}

                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* list of prices*/}
                    <div className="">
                        {/* price summary */}
                        <div className="flex flex-col">
                            <div className="flex flex-col items-center justify-center w-full bg-slate-100 p-3 rounded-md">
                                <div className="font-medium mt-2 mb-2">Price Summary</div>

                                {Object.keys(proda).map((key) => {
                                    let product:PRODUCTMODEL=proda[key];
                                    return(
                                        <div key={key} className="flex items-center border-b-2 border-b-slate-500 pb-2 mb-2">
                                            <div className="text-xl">{product.price}
                                            </div>
                                            <div className="ml-2 text-[9px]">{product.currency}</div>
                                        </div>
                                    );
                                })}

                                {/*Total Price*/}
                                <div className="flex items-center">
                                    <p className="text-medium text-2xl">Total : </p>
                                    <span className="ml-2 text-red-700 font-bold text-3xl">{getTheTotalPrice()}</span>
                                    <span className="text-[9px] ml-1">USD</span>
                                </div>

                                {/*Checkout Button*/}
                                <Link href="/action/checkout">
                                    <div className="hover:cursor-pointer mb-3 flex items-center justify-center mt-3 bg-green-600 p-2 text-white rounded-md">
                                        <div>Proceed To Checkout</div>
                                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </div>
                                </Link>


                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </Layout>
    );
}


export default CartPage;
