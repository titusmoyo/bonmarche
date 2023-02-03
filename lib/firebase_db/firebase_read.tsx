import {initFirebase} from "@lib/firebase_db/firebase_init";
import { jobStatusModel } from '@models/model';
import { serverTimestamp } from 'firebase/database';
import { PRODUCTMODEL } from '@models/model';
import { getDatabase, ref, child, get,onValue, query, orderByChild} from "firebase/database";


// Gets all posts from the database in reverse chronological order.
export const getDBProducts = async (path:string) => {
  // Because our exported functions can be called at any time from
  // any place in our app, we need to make sure we've initialized
  // a Firebase app every time these functions are invoked.
  initFirebase();
  //const result = [];
  const db = getDatabase();
  const OrderedPostsRef = query(ref(db,path), orderByChild('dateCreated'));

  const products=await get(OrderedPostsRef).then((snapshot) => {
    const result:PRODUCTMODEL[] = [];
    snapshot.forEach((child) => {
      //console.log(child.val());
      result.push(child.val());
    });
    return result.reverse();
  }).catch((error) => {
    console.log("****Error Here");
    console.error(error);
  });

  return products;
};



/*
Retrieves the data for a single post from a given slug.
TODO: *********
read : https://firebase.google.com/docs/database/web/read-and-write#web-version-9_4
//return onValue(ref(db, '/users/' + userId), (snapshot) => {
*/
export const getPostBySlug = async (slugPath:string) => {
  initFirebase();

  const db = getDatabase();
  //const auth = getAuth();
  const dbRef = ref(getDatabase());
  /*
  return get(child(dbRef,slugPath)).then((snapshot) => {
    return snapshot.val();
  },{onlyOnce: true}).catch((error) => {
    console.error(error);
  });
  */
};


export const getProductUsingSlug = async(slugPath: string)=>{
    initFirebase();
    const db = getDatabase();
    const dbRef = ref(getDatabase(),slugPath);
    //const auth = getAuth();
    
    const product=await get(dbRef).then((snapshot) => {
      return snapshot.val();
    }).catch((error) => {
      console.log("****Error Here");
      console.error(error);
    });

    return product;
}
