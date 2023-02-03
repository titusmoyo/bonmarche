import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from "react";
import { useAuth } from '@contexts/auth';
import { signOutUser } from '@lib/firebase_db/firebase_auth';
import SymbolLogo from '@components/logo/symbol_logo';
import LabelLogo from '@components/logo/label_logo';
import Layout from '@components/layout/layout';
import { getDatabase, ref, onValue} from "firebase/database";
import {initFirebase} from "@lib/firebase_db/firebase_init";
import { REALTIME_DATABASE_DB_TRENDING_LIST } from '@utils/constants/db_constants';
import { REALTIME_DATABASE_DB_CART_PRODUCTS } from '@utils/constants/db_constants';
import { useState,useEffect } from 'react';


const CartValuesComponent  = ({setCartCount}:{setCartCount: any}): JSX.Element => {
    const {user,dbuser} = useAuth();
    //const [ cartCount,setCartCount ] = useState(0);

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
                       let size = Object.keys(data).length;
                       setCartCount(size);
                       //setCartCount(size);
                   }//end of if
                 });
             }
         })();

    }, [user]);

    return(
        <></>
    );
};

export default CartValuesComponent;
