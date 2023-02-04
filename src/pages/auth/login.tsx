

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
import FullLogo from '@components/logo/full_logo';
import Link from 'next/link';


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
    <>
        <div>
        {/* container */}
            <div className="bg-blue-100 flex flex-col h-screen items-center justify-center">
                {/* registration form */}
                    <div className="bg-white p-3 w-11/12 md:w-5/12 rounded-md">

                        {/* logo */}
                        <div className="mb-3 flex justify-center items-center">
                            <Link
                                href="/" className="md:block">
                                <FullLogo h={130} w={130}/>
                            </Link>
                        </div>
                        {/* end of logo*/}

                        <form onSubmit={handleSubmit}>

                            <label className="block mb-5">
                                <span className="text-gray-700">Email address</span>
                                <input
                                  id="email"
                                  name="email"
                                  type="email"
                                  placeholder="joe.bloggs@example.com"
                                  className="focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                  value={values.email}
                                  onChange={handleChange}
                                  required
                                />
                            </label>

                            <label className="block mb-5">
                                <span className="text-gray-700">Password</span>
                                <input
                                  id="password"
                                  name="password"
                                  type="password"
                                  className="focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                  minLength={6}
                                  placeholder="type password"
                                  value={values.password}
                                  onChange={handleChange}
                                  required
                                />
                            </label>

                            {/* SignUp Button */}
                            <div className="mb-5">
                                <button type="submit" className="bg-indigo-600 text-white w-full p-2 rounded-lg text-xl font-bold focus:shadow-outline hover:bg-indigo-900">Log In</button>
                            </div>
                            {/* End of SignUp Button */}
                        </form>

                        {/*Social SignUp*/}
                        <div className="">
                            <div className="mb-4 grid grid-cols-2">
                                <div className="flex">
                                    <div className="flex-1 border-t-2 border-slate-400 m-3"></div>
                                    <div className="">OR</div>
                                </div>

                                <div className="flex">
                                    <div className="hidden text-slate-800">OR</div>
                                    <div className="flex-1 border-t-2 border-slate-400 m-3"></div>
                                </div>
                            </div>

                            {/*Lis of Social Logins*/}
                            <div onClick={handleGsignup} className="mb-3 flex justify-center items-center bg-slate-200 rounded-lg p-2 hover:bg-cyan-300 hover:cursor-pointer">
                                <div className="mr-3">
                                    <svg className="h-[30px] w-[30px]" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                                </div>

                                <div className="text-slate-900 font-medium">Continue With Google</div>
                            </div>
                            {/**/}
                        </div>
                        {/*End of Social Login*/}

                        {/*Already have an Account ?*/}
                            <div className="flex">
                                <div className="">Don't have an account?</div>
                                <div className="ml-2 text-indigo-600 font-medium"><Link href="/auth/signup">Sign Up</Link></div>
                            </div>
                        {/*end of has account*/}

                    </div>
                {/* end of reg form */}
            </div>
        {/**/}
        </div>
    </>
  );
};

export default SignInPage;
