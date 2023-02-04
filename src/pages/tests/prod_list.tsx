
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Layout from '@components/layout/layout';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import { PRODUCTMODEL } from '@models/model';
import { NextPage } from 'next';
import { getDBProducts } from '@lib/firebase_db/firebase_read';
import { REALTIME_DATABASE_DB_TRENDING_LIST } from '@utils/constants/db_constants';
import { REALTIME_DATABASE_DB_CART_PRODUCTS } from '@utils/constants/db_constants';
import { useAuth } from '@contexts/auth';
import { saveNodePathWithBoolean } from '@lib/firebase_db/firebase_writes';
import { getDatabase, ref, onValue} from "firebase/database";
import {initFirebase} from "@lib/firebase_db/firebase_init";
import Link from 'next/link';

function ProdList({ trendingProducts,cartButtonColors,ip,header }: { trendingProducts: PRODUCTMODEL[],cartButtonColors:any,ip:any,header:any }) {
    //console.log("testing context.req.header here ");
    //console.log(header);
    //console.log();

    const {user,dbuser} = useAuth();
    const [tempCartBbColor,setTempCartBgColor ] = useState(cartButtonColors);

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
                       Object.keys(data).forEach(key => {
                         let prodId= key; // key1, key2, key3
                         let isProductInCart = data[key]; // value1, value2, value3
                         if(isProductInCart){
                             //setTempCartBgColor({...tempCartBbColor,[prodId]:'bg-slate-500'});
                             setTempCartBgColor((prevState: any) => ({...prevState,[prodId]:'bg-slate-500'}));
                             //const updatedState = {...tempCartBbColor};
                         }
                       });
                   }//end of if
                 });
             }
         })();

    }, [user]);

    const addProductToCart=(selectedProduct:PRODUCTMODEL)=>{
        if(dbuser===null){
            console.log("user is null");
            return;
        }
        let path:string = REALTIME_DATABASE_DB_CART_PRODUCTS+dbuser['uid']+"/"+selectedProduct.productId;
        saveNodePathWithBoolean(path,true);
    }

    return (
        <>
        <div className="max-w-7xl mx-auto px-3 md:px-1 mt-3 mb-[20px]">
            <h4>Trending List </h4>
            <h4 className="">ip address = {ip} </h4>

            {/*Trending Products*/}
            <div className="mt-5"></div>


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {trendingProducts.map((product)=>(

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

                    <div  className="grid grid-cols-3 mt-2 items-center justify-center">

                      <p className="text-slate-800">{product.condition}</p>

                      <div className="flex items-center justify-center space-x-2">
                        <p className="text-lg font-bold">{product.price}</p>
                        <span className="text-[10px]">{product.currency}</span>
                      </div>


                      {/* add to cart button*/}
                      <div
                        onClick={()=>{addProductToCart(product);setTempCartBgColor({...tempCartBbColor,[product.productId]:'bg-slate-500'});}}
                        className={`${tempCartBbColor[product.productId]} hover:cursor-pointer flex items-center justify-center rounded-md p-1 text-white`}>
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <div className="text-sm md:text-base">Add To Cart</div>
                      </div>
                      {/* End of cart */}

                    </div>

                </div>

            ))}
            </div>

            {/*End of Trending Products*/}
        </div>
        </>
    );
}

// This is for fetching data every time the page is visited. We do this
// so that we don't have to redploy the site every time we add a blog post.
// oops
export async function getServerSideProps(context: any) {
  //const APPNAME=ZIMSEC_ZAMBUKO_PROJECT_ID;
  //const allfiles = await zmGetResourcesOrdered(ZM_REALTIME_DB_ALL_FILES,APPNAME);
  //console.log(resources);
  const forwarded = context.req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string' ? forwarded.split(/, /)[0] : context.req.socket.remoteAddress;

  // get files
  const trendingProducts = await getDBProducts(REALTIME_DATABASE_DB_TRENDING_LIST);

  const cartButtonColors:any={};

  if(trendingProducts){
      //console.log(trendingProducts[0]);
      for(let i=0;i<trendingProducts.length;i++){
          cartButtonColors[trendingProducts[i].productId]='bg-green-500';
      }
  }

  console.log(cartButtonColors);

  return {
    props: {
      //allfiles,
      trendingProducts:trendingProducts,
      cartButtonColors:cartButtonColors,
      ip:ip,
      header : JSON.parse(JSON.stringify(context.req.headers)),
      //header:context.req.headers,
      //context:JSON.parse(JSON.stringify(context)),
    },
  };

}


export default ProdList;
