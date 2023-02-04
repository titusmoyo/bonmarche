import {initFirebase} from "@lib/firebase_db/firebase_init";
import { getDatabase, ref, child,set,push} from "firebase/database";
import { jobStatusModel } from '@models/model';
import { serverTimestamp } from 'firebase/database';
import { PRODUCTMODEL } from '@models/model';

// save Db User
export const saveDbUser= async (path:any,dbuser:any,callback:any)=>{
  let jobStatus=jobStatusModel;
  jobStatus.jobDescription="saving data to realtime database path "+path;

  //const datecreated = new Date().getTime();
  dbuser.dateCreated = serverTimestamp();

  //console.log(post);
  const db = getDatabase();

  set(ref(db, path),dbuser)
  .then((res)=>{
      jobStatus.finished=true;
      callback(jobStatus,dbuser);
      //console.log(res.val());
  })
  .catch((error)=>{
    console.log("error catch saveDbUser");
    console.log(error);
    alert(error);
    jobStatus.error=true;
    callback(jobStatus,dbuser);
  })
}


// save product data
export const saveProductData= async (path:any,productData:PRODUCTMODEL,callback:any)=>{
  let jobStatus=jobStatusModel;
  jobStatus.jobDescription="saving product to product_data "+path;

  //const datecreated = new Date().getTime();
  productData.dateCreated = serverTimestamp();

  //console.log(post);
  const db = getDatabase();


  const productsRef = ref(db, path);
  const newProductRef = push(productsRef);
  const newKey = newProductRef.key;

  productData.productId=newKey??'';

  set(newProductRef,productData)
  .then((res)=>{
      jobStatus.finished=true;
      callback(jobStatus,productData);
      //console.log(res.val());
  })
  .catch((error)=>{
    console.log("error catch saveDbUser");
    console.log(error);
    alert(error);
    jobStatus.error=true;
    callback(jobStatus,productData);
  })
}


/* Saves path to bolean (true or false) */
export const saveNodePathWithBoolean = async (path:string,value:boolean)=>{
  //console.log(post);
  const db = getDatabase();
  set(ref(db,path),value)
  .then((res) => {
    // Update the isLoading state and navigate to the home page.
    //router.push('/');
    console.log("saveNodePathWithBoolean : success");
  })
  .catch((err) => {
    // Alert the error and update the isLoading state.
    //alert(err);
  });
}


/*
Deletes a post from the database.
*/
export const deletePathFromFbDb = async (path:string) => {
  initFirebase();
  //return firebase.database().ref(`/posts/${slug}`).set(null);
  const db = getDatabase();
  return set(ref(db,path),null);
};
