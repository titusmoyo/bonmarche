
import { SIGNUP_PAGE_INDEX } from '@utils/constants/layout_constants';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { CreateUserAccountUsingEmailAndPassword } from '@lib/firebase_db/firebase_auth';
import { signInUsingGooglePopUp } from '@lib/firebase_db/firebase_auth';
import { useAuth } from '@contexts/auth';
import { saveDbUser} from '@lib/firebase_db/firebase_writes';
import { UserModel } from '@models/model';
import { REALTIME_DATABASE_DB_USERS_PATH } from '@utils/constants/db_constants';
import { v4 as uuidv4 } from 'uuid';
import Layout from '@components/layout/layout';
import { JOB_TYPE_CREATE_ACC_EMAIL_PASS } from '@utils/constants/jobs_constants';
import { JOB_TYPE_ACC_GOOGLE_AUTH } from '@utils/constants/jobs_constants';
import { JOBSTATUSMODEL } from '@models/model';

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {user, userLoading} = useAuth();

  const [values, setValues] = useState({
    fullName:'',
    email:'',
    password: '',
  });

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

  const handleSubmit = async(e: { preventDefault: () => void; }) => {
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

    //values.email=createTemporaryEmail(values.userName);
    values.email=values.email.toLowerCase();

    // Update the isLoading state.
    setIsLoading(true);

    let dbuser=UserModel;
    dbuser.fullName=values.fullName;
    dbuser.email=values.email;

    console.log(dbuser);


    // create account using Email And Pass
    CreateUserAccountUsingEmailAndPassword(dbuser,values.email,
      values.password,receiverCreateAccUsingEmailPassResults);

  };

  // receiver results CreateUserAccountUsingEmailAndPassword
  const receiverCreateAccUsingEmailPassResults=(jobStatus:any,dbuser:any)=>{
    setIsLoading(false);
    console.log(jobStatus);
    // check if job was done properly
    if(jobStatus.finished){
      // add the user to the db database
      let db_user_path=REALTIME_DATABASE_DB_USERS_PATH+dbuser.uid;
      saveDbUser(db_user_path,dbuser,receiverRealTimeDbResults);
    }else if(jobStatus.error){
      // handle error
      console.log("now in receiverCreateAccUsingEmailPassResults");
      alert(jobStatus.errorMessage);
    }
  }

  // sign up using google
  const handleGsignup=()=>{
    console.log("Signup using google");
    // Update the isLoading state.
    setIsLoading(true);
    let dbuser=UserModel;
    //signInUsingGooglePopUp(dbuser,{setIsLoading},callback);
    signInUsingGooglePopUp(dbuser,receiverGoogleSignInResults);
  }

 // receivers results from isNodeAvailable
 const receiverGoogleSignInResults=(jobStatus:JOBSTATUSMODEL,dbuser:any)=>{
    console.log(jobStatus);
    if(jobStatus.finished && jobStatus.jobType===JOB_TYPE_ACC_GOOGLE_AUTH){
    // check if user is a new user
        if(jobStatus.isNewUser){
            let db_user_path=REALTIME_DATABASE_DB_USERS_PATH+dbuser.uid;
            console.log("now here receiverIsNodeAvailableResults");
            saveDbUser(db_user_path,dbuser,receiverRealTimeDbResults);
        }else{
            console.log("User Already Exists ; its a login");
        }
    }//end of if
 }

  // receiver results RealTime database SaveData
  const receiverRealTimeDbResults=(jobStatus:JOBSTATUSMODEL,dbuser:any)=>{
    setIsLoading(false);
    console.log(jobStatus);
    // check if job was done properly
    if(jobStatus.finished){
      console.log("user data saved successfully oops *** ici Zoust");
    }else if(jobStatus.error){
      // handle error
    }
  }

  return (
    <Layout childType={SIGNUP_PAGE_INDEX}>
      <form onSubmit={handleSubmit}>
        <h1>Create An Account</h1>

        <div>
          <label htmlFor="fullName">Nom et Prenom</label>
          <input
            id="fullName"
            type="text"
            value={values.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email Address</label>
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

        <button type="submit">Create Account</button>

        <p onClick={handleGsignup}>Signup using google</p>

      </form>
    </Layout>
  );
};

export default SignUpPage;
