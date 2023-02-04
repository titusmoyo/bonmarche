import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Layout from '@components/layout/layout';
import { useState,useEffect } from 'react';
import { useRouter } from 'next/router';
import { PRODUCTMODEL } from '@models/model';
import { NextPage } from 'next';
import { CHECKOUT_PAGE_INDEX} from '@utils/constants/layout_constants';

const CheckoutPage=()=>{
    return(
        <Layout childType={CHECKOUT_PAGE_INDEX}>
            <div>harold</div>
        </Layout>
    );
}


export default CheckoutPage;
