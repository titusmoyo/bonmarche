import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Layout from '@components/layout/layout';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import { PRODUCTMODEL } from '@models/model';
import { getProductUsingSlug } from '@lib/firebase_db/firebase_read';
import { REALTIME_DATABASE_DB_PRODUCT_LIST } from '@utils/constants/db_constants';
import { PRODUCT_PAGE_INDEX } from '@utils/constants/layout_constants';
import { useAuth } from '@contexts/auth';
import { REALTIME_DATABASE_DB_TRENDING_LIST } from '@utils/constants/db_constants';
import { REALTIME_DATABASE_DB_CART_PRODUCTS } from '@utils/constants/db_constants';
import { saveNodePathWithBoolean } from '@lib/firebase_db/firebase_writes';
import Link from 'next/link';


const ProductPage=({currentProduct,slug}:{currentProduct:PRODUCTMODEL,slug:any})=>{
    const {user,dbuser} = useAuth();

    // console.log("id>>"+currentProduct.productId);
    // console.log(currentProduct);
    currentProduct.description=currentProduct.description.trim();

    const addProductToCartAndPurchase=(selectedProduct:PRODUCTMODEL)=>{
        if(dbuser===null){
            console.log("user is null");
            return;
        }
        let path:string = REALTIME_DATABASE_DB_CART_PRODUCTS+dbuser['uid']+"/"+selectedProduct.productId;
        saveNodePathWithBoolean(path,true);
    }//

    return(
        <Layout  childType={PRODUCT_PAGE_INDEX}>
            <div className="grid grid-cols-1 md:gap-3 md:grid-cols-3 p-2 border rounded-lg pt-[10px] pb-[30px]">

                {/* First side*/}
                <div className="flex flex-col items-center">
                    {/*Image Container*/}
                    <div className="group h-60 w-[220px] relative">
                        <Image
                          src={currentProduct.mainImageUrl}
                          alt="Picture of the author"
                          fill
                          className=""
                        />
                    </div>

                    <p>{currentProduct.productName}</p>

                </div>
                {/* End of First Side*/}

                {/*Second Side*/}
                <div className="">
                    <div>
                        <div>{currentProduct.description.split('\n').map((item, key) => {
                          return <span key={key} className="">{item}<br/></span>
                        })}</div>
                    </div>
                </div>
                {/* End of Second Side*/}

                {/* Third Side*/}
                <div className="md:px-3">
                    <div className="flex flex-col space-y-2">
                        <div>Manufacturer : <span className="font-medium">{currentProduct.manufacturer}</span></div>
                        <div>Condition : <span className="font-medium">{currentProduct.condition}</span></div>
                        <div>In Stock : <span className="font-medium">{currentProduct.quantity}</span></div>

                        <div className="flex text-2xl font-bold">
                            <div className="">Price : </div>
                            <div className="ml-2 text-red-500">
                                <span className="">{currentProduct.price}</span>
                                <span className="ml-2">{currentProduct.currency}</span>
                            </div>
                        </div>

                        <Link href="/action/cart">
                            {/* add to cart button */}
                            <div
                              onClick={()=>{addProductToCartAndPurchase(currentProduct);}}
                              className={`bg-green-600 hover:cursor-pointer flex items-center justify-center rounded-md p-1 text-white`}>
                              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                              </svg>
                              <div className="">Buy Now</div>
                            </div>
                            {/* End of cart */}
                        </Link>
                    </div>
                </div>
                {/*End of Third Side*/}

            </div>
        </Layout>
    );
}


// This is for fetching data every time the page is visited. We do this
// so that we don't have to redploy the site every time we add a blog post.
// oops
export async function getServerSideProps(context: any) {
  //const currentProduct = await getDBProducts(REALTIME_DATABASE_DB_TRENDING_LIST);
  let slug=context.query.slug;
  let path = REALTIME_DATABASE_DB_PRODUCT_LIST+slug;

  let currentProduct = await getProductUsingSlug(path);

  return {
    props: {
      //context:JSON.parse(JSON.stringify(context)),
      currentProduct:currentProduct,
      slug:slug
    },
  };

}


export default ProductPage;
