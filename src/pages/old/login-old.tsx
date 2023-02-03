

import { LOGIN_PAGE_INDEX } from '@utils/constants/layout_constants';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { SignInUserUsingEmailAndPassword } from '@lib/firebase_db/firebase_auth';
import { useAuth } from '@contexts/auth';
import { UserModel } from '@models/model';
import { signInUsingGooglePopUp } from '@lib/firebase_db/firebase_auth';
import { saveDbUser} from '@lib/firebase_db/firebase_writes';
import { GoogleAuthProvider,getAdditionalUserInfo } from "firebase/auth";
import { REALTIME_DATABASE_DB_USERS_PATH } from '@utils/constants/db_constants';
import { JOB_TYPE_ACC_GOOGLE_AUTH } from '@utils/constants/jobs_constants';
import { JOBSTATUSMODEL } from '@models/model';
import Layout from '@components/layout/layout';

const SignInPage = () => {
  const router = useRouter();
  const {user, userLoading} = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  if (userLoading) {
    return <h1>Loading...</h1>;
  }

  if (user && typeof window !== 'undefined') {
    router.push('/');
    return null;
  }

  const handleChange = (e: { target: { id: any; value: any; }; }) => {
    const id = e.target.id;
    const newValue = e.target.value;

    setValues({ ...values, [id]: newValue });
  };

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    let missingValues: string[] = [];
    Object.entries(values).forEach(([key, value]) => {
      if (!value) {
        missingValues.push(key);
      }
    });

    if (missingValues.length > 1) {
      alert(`You're missing these fields: ${missingValues.join(', ')}`);
      return;
    }
    let user_email=values.email;
    // Update the isLoading state.
    setIsLoading(true);
    SignInUserUsingEmailAndPassword(user_email, values.password,receiverSignInResults);
  };

  // receiver results CreateUserAccountUsingEmailAndPassword
  const receiverSignInResults=(jobStatus:JOBSTATUSMODEL)=>{
    setIsLoading(false);
    console.log(jobStatus);
    // check if job was done properly
    if(jobStatus.finished){
        // add the user to the db database
    }else if(jobStatus.error){
        // handle error
        console.log("receiverignInUsingEmailPassResults");
        //alert(jobStatus.errorMessage);
    }
}// end of receiverSignInUsingEmailPassResults

  // sign in using google
  const handleGsignup=()=>{
    // Update the isLoading state.
    setIsLoading(true);
    let dbuser = UserModel;
    //signInUsingGooglePopUp(dbuser,{setIsLoading},callback);
    signInUsingGooglePopUp(dbuser,receiverGoogleSignInResults);
  }

  // receiver results from google signup
  const receiverGoogleSignInResults = (jobStatus:JOBSTATUSMODEL,dbuser:any)=>{
      console.log(jobStatus);
      if(jobStatus.finished && jobStatus.jobType===JOB_TYPE_ACC_GOOGLE_AUTH){
      // check if user is a new user
          if(jobStatus.isNewUser){
              let db_user_path=REALTIME_DATABASE_DB_USERS_PATH+dbuser.uid;
              console.log("now here receiverIsNodeAvailableResults");
              saveDbUser(db_user_path, dbuser, receiverSignInResults);
          }else{
              console.log("User Already Exists ; its a login"); 
          }
      }//end of receiverGoogleSignInResults
  }

  return (
    <Layout childType={LOGIN_PAGE_INDEX}>
        <div>
          <form onSubmit={handleSubmit}>
            <h1>Please Sign In</h1>

            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit">Sign In</button>
            <p onClick={handleGsignup}>Login using google</p>
          </form>

        </div>
    </Layout>
  );
};

export default SignInPage;
