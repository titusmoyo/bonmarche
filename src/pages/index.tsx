
import { HOME_PAGE_INDEX } from '@utils/constants/layout_constants';
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Layout from '@components/layout/layout';
import Link from 'next/link';
import  ProdList from '@components/pg/prod_list';
import { getDBProducts } from '@lib/firebase_db/firebase_read';
import { REALTIME_DATABASE_DB_TRENDING_LIST } from '@utils/constants/db_constants';
import { REALTIME_DATABASE_DB_CART_PRODUCTS } from '@utils/constants/db_constants';
import { PRODUCTMODEL } from '@models/model';

const inter = Inter({ subsets: ['latin']})


export default function Home({ trendingProducts,cartButtonColors,ip,header }: { trendingProducts: PRODUCTMODEL[],cartButtonColors:any,ip:any,header:any }) {
  return (
    <Layout childType={HOME_PAGE_INDEX}>

      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>

        {/* Trending products*/}
        <ProdList trendingProducts={trendingProducts} cartButtonColors={cartButtonColors} ip={ip} header={header}/>
        {/* End of Trending Products */}

      </main>

    </Layout>
    );
};




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
