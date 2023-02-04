import Head from 'next/head'
import Image from 'next/image'
import { useAuth } from '@contexts/auth';
import { Inter } from '@next/font/google'
import Layout from '@components/layout/layout';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import { PRODUCTMODEL } from '@models/model';
import { NextPage } from 'next';
import { CHECKOUT_PAGE_INDEX} from '@utils/constants/layout_constants';
import { getDatabase, ref, onValue} from "firebase/database";
import {initFirebase} from "@lib/firebase_db/firebase_init";
import { REALTIME_DATABASE_DB_PRODUCT_LIST, REALTIME_DATABASE_DB_TRENDING_LIST } from '@utils/constants/db_constants';
import { REALTIME_DATABASE_DB_CART_PRODUCTS } from '@utils/constants/db_constants';
import { getProductUsingSlug } from '@lib/firebase_db/firebase_read';

const CheckoutPage=()=>{

    const {user,dbuser} = useAuth();
    const [ paymentOption, setPaymentOption] = useState(0);
    const [ cartProducts, setCartProducts ] = useState<PRODUCTMODEL[]>([]);
    const [ proda,setProda ] = useState<Record<string,PRODUCTMODEL>>({});

    const [ cardValues, setCardValues] = useState({
      cardNumber:'',
      expiryDate:'',
      cvv:'',
      nameOnCard:'',
    });

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

    const handleOptionChange = (index:number) => {
      console.log(">>>> huyoooooo : "+index);
      setPaymentOption(index);
    }

    //listens to form data changes
    const handleCardFormChanges = (e: { target: { id: any; value: any; }; }) => {
      const id = e.target.id;
      const newValue = e.target.value;
      setCardValues({...cardValues, [id]: newValue });
    };

    const handleCreditCardSubmit=async(e: { preventDefault: () => void; })=>{
        e.preventDefault();
        console.log("credit card clicked ");
        console.log(cardValues);
        setCardValues({
            cardNumber:'',
             expiryDate:'',
             cvv:'',
             nameOnCard:'',
         });
    }

    return(
        <Layout childType={CHECKOUT_PAGE_INDEX}>
            <div className="max-w-6xl mx-auto px-3 mb-[130px]">

                <div className="mt-3 mb-3">

                    <p className="text-base mb-3">Please choose your preferred method of payment.</p>

                    {/* radio buttons */}
                    <div>

                        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                            <li onClick={()=>{handleOptionChange(0);}} className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input defaultChecked id="horizontal-list-radio-license" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                    <label htmlFor="horizontal-list-radio-license" className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Credit Card / Debit card (Visa and Mastercard) </label>
                                </div>
                            </li>
                            <li onClick={()=>{handleOptionChange(1);}} className="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input id="horizontal-list-radio-id" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                    <label htmlFor="horizontal-list-radio-id" className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Paypal</label>
                                </div>
                            </li>
                            <li onClick={()=>{handleOptionChange(2);}} className="opacity-40 w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input disabled id="horizontal-list-radio-millitary" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                    <label htmlFor="horizontal-list-radio-millitary" className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">BaridMob</label>
                                </div>
                            </li>
                            <li onClick={()=>{handleOptionChange(3);}} className="opacity-40 w-full dark:border-gray-600">
                                <div className="flex items-center pl-3">
                                    <input  disabled id="horizontal-list-radio-passport" type="radio" value="" name="list-radio" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                                    <label htmlFor="horizontal-list-radio-passport" className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Bank Wire Transfer</label>
                                </div>
                            </li>
                        </ul>

                    </div>

                    {/*End of Radio Button*/}
                </div>

                {/* Card Payment */}
                <div className="">

                    <div className="">

                        <div className="grid grid-cols-1 md:grid-cols-2">

                            <div className="relative">
                                <img className="h-full w-full rounded-l-md" src="https://imgur.com/cOwXXFq.jpg"/>
                                <div className="h-48 w-72 opacity-70 rounded-lg  bg-blue-300 absolute top-10 md:top-28 left-8 ">
                                    <div className="p-2 mt-3 text-black font-semibold">
                                        <p >Card Number</p>
                                        <p className="border-b-2 text-white shown_number">0000 0000 0000 0000</p>
                                    </div>
                                    <div className="flex gap-3 mt-3">
                                        <div className="p-2 mt-2 text-black font-semibold">
                                            <p >Expiry Date</p>
                                            <p className="border-b-2 text-white shown_expiry">mm/yyyy</p>
                                        </div>
                                        <div className="p-2 mt-2 text-black font-semibold">
                                            <p >CVV</p>
                                            <p className="border-b-2 text-white shown_cvv">000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <form onSubmit={handleCreditCardSubmit}>
                                <div className="bg-slate-300 rounded-r-md p-3">
                                    <p className="mt-3 text-xl font-semibold">Payment Details</p>
                                    <div className="mt-5 relative">
                                    <input
                                        required
                                        id="cardNumber"
                                        value={cardValues.cardNumber}
                                        onChange={handleCardFormChanges}
                                        className="input_number h-12 w-full border border-white transition-all rounded-lg px-2 outline-none focus:border-blue-900"
                                        type="text"
                                        placeholder="0000 0000 0000 0000"
                                        data-slots="0"
                                        data-accept="\d"
                                        size={19}/>
                                    <label className="text-xs absolute -top-4 left-0">Card Number</label> </div>
                                    <div className="mt-7 w-full flex gap-3">
                                        <div className=" relative w-full">
                                        <input
                                            required
                                            id="expiryDate"
                                            value={cardValues.expiryDate}
                                            onChange={handleCardFormChanges}
                                            className="input_expiry h-12 w-full border border-white transition-all rounded-lg px-2 outline-none focus:border-blue-900"
                                            placeholder="mm/yyyy"
                                            data-slots="my"
                                            type="text" />
                                        <label className="text-xs absolute -top-4 left-0" >Expiry Date</label> </div>
                                        <div className=" relative w-full">
                                            <input
                                                required
                                                id="cvv"
                                                value={cardValues.cvv}
                                                onChange={handleCardFormChanges}
                                                className="input_cvv h-12 w-full border border-white transition-all rounded-lg px-2 outline-none focus:border-blue-900"
                                                type="text"
                                                placeholder="000"
                                                data-slots="0"
                                                data-accept="\d"
                                                size={3}  /> <label className="text-xs absolute -top-4 left-0">CVV</label> </div>
                                    </div>
                                    <div className="mt-7 relative">

                                    <input
                                        required
                                        id="nameOnCard"
                                        value={cardValues.nameOnCard}
                                        onChange={handleCardFormChanges}
                                        className="h-12 w-full border border-white transition-all rounded-lg px-2 outline-none focus:border-blue-900"
                                        type="text"/> <label className="text-xs absolute -top-4 left-0">Name on Card</label> </div>

                                    <div className="mt-3 flex items-center">
                                        <div className="">Amount due : </div>
                                        <div className="ml-2 text-red-800 text-xl">{getTheTotalPrice()}</div>
                                        <div className="text-[9px] ml-1">USD</div>
                                    </div>

                                    <div className="mb-5">
                                        <button
                                        className="w-full flex items-center justify-center bg-green-500 text-white p-2 rounded-md mt-4 text-xl hover:cursor-pointer hover:bg-yellow-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                            <div>Pay Now</div>
                                        </button>
                                    </div>
                                </div>
                            </form>


                        </div>

                    </div>
                </div>
                {/* End of Card Payment*/}
            </div>
        </Layout>
    );
}


export default CheckoutPage;
