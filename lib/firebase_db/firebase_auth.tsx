

import {initFirebase} from "@lib/firebase_db/firebase_init";
import { getDatabase, ref, onValue} from "firebase/database";
import { onAuthStateChanged,
  signInWithEmailAndPassword,signOut,
  createUserWithEmailAndPassword} from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider,
  getAdditionalUserInfo,updateProfile,getAuth} from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";
import { jobStatusModel } from '@models/model';
import { JOB_TYPE_CREATE_ACC_EMAIL_PASS } from '@utils/constants/jobs_constants';
import { JOB_TYPE_ACC_GOOGLE_AUTH } from '@utils/constants/jobs_constants';
import { JOB_TYPE_SIGNIN_EMAIL_PASS } from '@utils/constants/jobs_constants';

export const ObserverOnAuthStateChanged = async (callback:any) => {
  initFirebase();
  const auth = getAuth();
  return onAuthStateChanged(auth, (user) => callback(user));
}

export const ObserverDbUSersState = async (username:any,tempDbUser:any,callback:any) => {
  initFirebase();
  const db = getDatabase();
  const dbRef = ref(db, 'dbusers/'+username);
  return onValue(dbRef, (snapshot) =>{
    if(tempDbUser===null){
      callback(snapshot.val());
    }
  });
  //callback(username);
}




/*
Signs out the authenticated user.
*/
export const signOutUser = async () => {
  initFirebase();
  const auth = getAuth();
  return signOut(auth);
};


export const CreateUserAccountUsingEmailAndPassword = async (dbuser:any,email:string,password:string,callback:any) => {
  let jobStatus=jobStatusModel;
  jobStatus.jobType=JOB_TYPE_CREATE_ACC_EMAIL_PASS;
  jobStatus.jobDescription="creating user account using email and password";

  initFirebase();
  const auth = getAuth();

  createUserWithEmailAndPassword(auth,email,password)
  .then((userCredential)=>{
    const user = userCredential.user;
    //console.log(user);
    dbuser.uid=user.uid;
    jobStatus.finished=true;
    callback(jobStatus,dbuser);
  })
  .catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
    jobStatus.finished=false;
    jobStatus.error=true;
    jobStatus.errorMessage=errorMessage;
    callback(jobStatus,dbuser);
  });

}//end of CreateUserAccountUsingEmailAndPassword


/*
Authenticate with Firebase using the Google provider object. You can prompt your users
 to sign in with their Google Accounts either by opening a pop-up window o
*/
export const signInUsingGooglePopUp = async (dbuser:any,callback:any) => {
  let jobStatus=jobStatusModel;
  jobStatus.jobType=JOB_TYPE_ACC_GOOGLE_AUTH;
  jobStatus.jobDescription="authenticating user using GoogleAuthProvider";

  initFirebase();
  const auth = getAuth();
  // Inside AuthProvider
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider)
  .then((result)=>{
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential:any = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      dbuser.phoneNumber=user.phoneNumber;
      dbuser.email=user.email;
      dbuser.emailVerified=user.emailVerified;
      dbuser.uid=user.uid;
      dbuser.fullName=user.displayName;
      dbuser.photoURL=user.photoURL;

      if(user.phoneNumber===null){
        dbuser.phoneNumber="";
      }

      //const { isNewUser } = getAdditionalUserInfo(result);
      const additionalUserInfo = getAdditionalUserInfo(result);

      jobStatus.finished=true;
      jobStatus.isNewUser=additionalUserInfo?.isNewUser?? false;

      callback(jobStatus,dbuser);

  }).catch((error)=>{
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      const credential = GoogleAuthProvider.credentialFromError(error);

      console.log("error : signInUsingGooglePopUp");
      console.log(errorMessage);
      jobStatus.error=true;
      jobStatus.errorMessage=errorMessage;
      callback(jobStatus,dbuser);
  });
};

/*
    Attempts to authenticate a user with a given email and password.
*/
export const SignInUserUsingEmailAndPassword = async (email:string, password:string,callback:any) => {
  let jobStatus=jobStatusModel;
  jobStatus.jobType=JOB_TYPE_SIGNIN_EMAIL_PASS;
  jobStatus.jobDescription="SignInUserUsingEmailAndPassword() signing up the user using and pass";

  initFirebase();
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((res)=>{
      jobStatus.finished=true;
      callback(jobStatus);
    })
    .catch((error) => {
      console.log("error => ");
      console.log(error);
      const errorMessage=error.errorMessage;
      jobStatus.error=true;
      jobStatus.errorMessage=errorMessage;
      callback(jobStatus);
  });
}
