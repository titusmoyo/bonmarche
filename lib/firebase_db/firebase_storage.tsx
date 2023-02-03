import {initFirebase} from "@lib/firebase_db/firebase_init";
import { getDatabase, ref, child,set,push} from "firebase/database";
import { jobStatusModel } from '@models/model';
import { JOB_TYPE_UPLOAD_FILE_TO_STORAGE } from '@utils/constants/jobs_constants';
import { getStorage, uploadBytesResumable, getDownloadURL,ref as sRef } from "firebase/storage";
import { initializeApp, getApps, getApp } from "firebase/app";
import { PRODUCTMODEL } from '@models/model';

/**
*
* input
* path : () e.g posts/forum/hshghdgehgehghdhed.jpg
* file : ( file form form input )
* callback : ( function that receives updates )
* */
export const makeAnUploadToFirebasStorage = async (path:string,file: any,productData:PRODUCTMODEL,{setUploadProgress}: any,
    callback: (arg0:any, arg1: PRODUCTMODEL) => void) => {

    let jobStatus=jobStatusModel;
	jobStatus.jobDescription="makeAnUploadToFirebasStorage() uploading a file to storage";
	jobStatus.jobType=JOB_TYPE_UPLOAD_FILE_TO_STORAGE;

	initFirebase();
	// Initialize Cloud Storage and get a reference to the service
	const storage = getStorage(getApp());

	// Upload file and metadata to the object 'images/mountains.jpg'
	const storageRef = sRef(storage, path);

	const uploadTask = uploadBytesResumable(storageRef,file);

	// Listen for state changes, errors, and completion of the upload.
	uploadTask.on('state_changed',
	(snapshot) => {
	  // Get task progress, including the number of bytes uploaded and the total number of bytes
	  //to be uploaded
	  const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
	  console.log('Upload is ' + progress + '% done');

	  setUploadProgress(progress);

	  switch (snapshot.state) {
	    case 'paused':
	      console.log('Upload is paused');
	      break;
	    case 'running':
	      console.log('Upload is running');
	      break;
	  }
	},
	(error) => {
	  // A full list of error codes is available at
	  // https://firebase.google.com/docs/storage/web/handle-errors
	  switch (error.code) {
	    case 'storage/unauthorized':
	      // User doesn't have permission to access the object
	      break;
	    case 'storage/canceled':
	      // User canceled the upload
	      break;

	    // ...
	    case 'storage/unknown':
	      // Unknown error occurred, inspect error.serverResponse
	      break;
	  }
	},
	() => {
	  // Upload completed successfully, now we can get the download URL
	  getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
	    console.log('File available at', downloadURL);
	    // call back
	    jobStatus.finished=true;
	    jobStatus.output=downloadURL;
        productData.mainImageUrl=downloadURL;
	    callback(jobStatus,productData);
	  }).catch((error)=>{
	  	let errorMessage=error.errorMessage;
	  	console.log("saataani wemaroma");
	  	console.log(error);
	  	alert(error);
        jobStatus.finished=false;
        jobStatus.output=errorMessage;
        jobStatus.error=errorMessage;
        callback(jobStatus,productData);
	  });

	});
}
