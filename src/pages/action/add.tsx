

import { ADD_PAGE_INDEX } from '@utils/constants/layout_constants';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@contexts/auth';
import Layout from '@components/layout/layout';
import FullLogo from '@components/logo/full_logo';
import Link from 'next/link';
import { PRODUCTMODEL } from '@models/model';
import { saveProductData } from '@lib/firebase_db/firebase_writes';
import { REALTIME_DATABASE_DB_PRODUCT_LIST } from '@utils/constants/db_constants';
import { JOBSTATUSMODEL } from '@models/model';
import { getFileSizeMb,isThisAnImage } from '@utils/functions/util';
import { STORAGE_IMAGE_MAXIMUM_SIZE } from '@utils/constants/db_constants';
import { ALLOWED_IMAGE_EXTENSIONS } from '@utils/constants/db_constants';
import { v4 as uuidv4 } from 'uuid';
import { FB_STORAGE_PRODUCT__IMAGE } from '@utils/constants/db_constants';
import { makeAnUploadToFirebasStorage } from '@lib/firebase_db/firebase_storage';
import { JOB_TYPE_UPLOAD_FILE_TO_STORAGE } from '@utils/constants/jobs_constants';
import PacmanLoader from "react-spinners/PacmanLoader";
import { REALTIME_DATABASE_DB_PRODUCT_TYPE } from '@utils/constants/db_constants';
import { REALTIME_DATABASE_DB_PRODUCT_CONDITION } from '@utils/constants/db_constants';
import { saveNodePathWithBoolean } from '@lib/firebase_db/firebase_writes';

const AddPage =()=>{
    const router = useRouter();
    const {user, userLoading} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [mediaFile,setMediaFile]=useState(null);
    const [uploadProgress,setUploadProgress]=useState(null);

    const [values, setValues] = useState({
        productId:'',
        productType:'Phone',
        productName:'',
        manufacturer:'',
        price:'',
        currency:'',
        quantity:'',
        condition:'New',
        mainImageUrl:'',
        description:'',
        sellerId:'',
        isTrending:false,
    });

    if (userLoading) {
      return <h1>Loading...</h1>;
    }

    if (user===null || user===undefined) {
      console.log("user ::: ");
      console.log(user);
      router.push('/auth/signup');
      return null;
    }

    const handleChange = (e : { target : { id : any, value : any} } ) => {
        const id = e.target.id;
        const newValue = e.target.value;
        setValues({ ...values, [id]: newValue });
    }

    // handles file changes
    const handleFileChange=async(e: { target: any; })=>{
      const target = e.target;
      const file = target.files[0];
      const name = target.name;

      if(file===undefined){
          return;
      }

      console.log(file);

      const fileSize:number = getFileSizeMb(file.size);

      if(fileSize>STORAGE_IMAGE_MAXIMUM_SIZE){
        alert("The image must be less than "+STORAGE_IMAGE_MAXIMUM_SIZE+" mb");
        return;
      }

      if(!isThisAnImage(file.name,ALLOWED_IMAGE_EXTENSIONS)){
          alert('Only images are allowed');
          return;
      }

      // setting the mediaFile
      setMediaFile(file);
    }

    /*

    uploads image and insets data to the database

    */
    const handleSubmit = async(e: { preventDefault: () => void; }) => {
      e.preventDefault();

      if(mediaFile===null){
        alert("Please select the Product Image");
        return;
      }

      // set is loading
      setIsLoading(true);

      let productData:PRODUCTMODEL={
          ...values,
          price:parseInt(values.price+''),
          quantity:parseInt(values.quantity+''),
          sellerId:user['uid'],
          dateCreated: undefined,
      };

      console.log(productData);
      //console.log(user);


      // getting the filex extension
      let ext:string = mediaFile['name'];
      let file_extension:string = ext.split(".")[1];

      let file_id = uuidv4();
      let path = FB_STORAGE_PRODUCT__IMAGE+file_id+"."+file_extension;

      // makeAnUploadToFirebasStorage = async (path:string,file: any,productData:PRODUCTMODEL,{setUploadProgress}: any,callbac)
      makeAnUploadToFirebasStorage(path,mediaFile,productData,{setUploadProgress},receiverUploadResults);
    }

    // receiver results from upload activity
    const receiverUploadResults=(jobStatus:JOBSTATUSMODEL,productData:PRODUCTMODEL)=>{
      console.log(jobStatus);
      // check if the file was successfully uploaded
      if(jobStatus.finished && jobStatus.jobType===JOB_TYPE_UPLOAD_FILE_TO_STORAGE){
          // saveProductData= async (path:any,productData:PRODUCTMODEL,callback:any)
          saveProductData(REALTIME_DATABASE_DB_PRODUCT_LIST,productData,receiverRealTimeDbResults);
      }else{
        setIsLoading(false);
      }
    }


    // receiver results RealTime database SaveData
    const receiverRealTimeDbResults=(jobStatus:JOBSTATUSMODEL,productData:PRODUCTMODEL)=>{
      setIsLoading(false);
      console.log(jobStatus);
      // check if job was done properly
      if(jobStatus.finished){
        //console.log("user data saved successfully oops *** ici Zoust");

        // saving it to type and condition
        let path_to_type = REALTIME_DATABASE_DB_PRODUCT_TYPE+productData.productType.toLowerCase()+"/"+productData.productId;
        saveNodePathWithBoolean(path_to_type,true);

        let path_to_condition = REALTIME_DATABASE_DB_PRODUCT_CONDITION+productData.condition.toLowerCase()+"/"+productData.productId;
        saveNodePathWithBoolean(path_to_condition,true);

        // go to the main menu
        //alert("Product has been added successfully");
        router.push('/');
      }else if(jobStatus.error){
        // handle error
      }
    }

    return(
        <Layout childType={ADD_PAGE_INDEX}>
            <div className="">
            {/* container */}
                <div className="p-4">
                    {/* registration form */}
                        <div className="">
                            <form onSubmit={handleSubmit}>

                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {/* Side A */}
                                    <div className="">
                                        <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                            <span className="text-gray-700 mr-4 col-span-1">Product Type</span>
                                            <select
                                              className="col-span-3 p-2 focus:outline-none block w-full mt-1 border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                              id="productType"
                                              name="productType"
                                              onChange={handleChange}>
                                              <option value="Phone">Phone</option>
                                              <option value="Laptop">Laptop</option>
                                              <option value="Desktop">Desktop</option>
                                            </select>
                                        </label>

                                        <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                            <span className="text-gray-700 mr-4 col-span-1">Product Name</span>
                                            <input
                                              id="productName"
                                              name="productName"
                                              type="text"
                                              placeholder="Samsung Galaxy s10"
                                              value={values.productName}
                                              onChange={handleChange}
                                              className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                              required
                                            />
                                        </label>

                                        <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                            <span className="text-gray-700 mr-4 col-span-1">Manufacturer</span>
                                            <input
                                              id="manufacturer"
                                              name="manufacturer"
                                              type="text"
                                              placeholder="e.g Samsung, Dell, Apple ... "
                                              value={values.manufacturer}
                                              onChange={handleChange}
                                              className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                              required
                                            />
                                        </label>

                                        <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                            <span className="text-gray-700 mr-4 col-span-1">Price</span>
                                            <input
                                              id="price"
                                              name="price"
                                              type="number"
                                              placeholder="e.g 1500 "
                                              value={values.price}
                                              onChange={handleChange}
                                              className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                              required
                                            />
                                        </label>

                                        <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                            <span className="text-gray-700 mr-4 col-span-1">Currency</span>
                                            <input
                                              id="currency"
                                              name="currency"
                                              type="text"
                                              placeholder="e.g USD, DA, EURO"
                                              value={values.currency}
                                              onChange={handleChange}
                                              className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                              required
                                            />
                                        </label>


                                        <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                            <span className="text-gray-700 mr-4 col-span-1">Product Description</span>
                                            <textarea
                                              rows={3}
                                              id="description"
                                              name="description"
                                              placeholder="please add as much details as possible"
                                              value={values.description}
                                              onChange={handleChange}
                                              className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                              required
                                            />
                                        </label>

                                    </div>
                                    {/* end of Side A*/}


                                    {/* Side B */}
                                    <div className="md:ml-3 px-2 md:border-l-2 md:border-l-slate-100">
                                        <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                            <span className="text-gray-700 mr-4 col-span-1">Condition</span>
                                            <select
                                              className="col-span-3 p-2 focus:outline-none block w-full mt-1 border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                              id="condition"
                                              name="condition"
                                              onChange={handleChange}>
                                              <option value="New">New</option>
                                              <option value="Used">Used</option>
                                            </select>
                                        </label>

                                        <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                            <span className="text-gray-700 mr-4 col-span-1">Quantity</span>
                                            <input
                                              id="quantity"
                                              name="quantity"
                                              type="number"
                                              placeholder="e.g 4"
                                              value={values.quantity}
                                              onChange={handleChange}
                                              className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                              required
                                            />
                                        </label>

                                        <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                            <span className="text-gray-700 mr-4 col-span-1">Product Image</span>
                                            <input
                                              id="mainImageUrl"
                                              name="mainImageUrl"
                                              type="file"
                                              placeholder="e.g Samsung, Dell, Apple ... "
                                              className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                              onChange={handleFileChange}
                                              required
                                            />
                                        </label>


                                        <div className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mt-2 mb-5">
                                            <div className="col-span-1">
                                                <PacmanLoader
                                                        color="#4F46E5"
                                                        loading={isLoading}
                                                        size={20}
                                                        aria-label="Loading Spinner"
                                                        data-testid="loader"
                                                      />
                                            </div>
                                            {/* Add Button */}
                                            <div className="col-span-3 ">
                                                <button disabled={false} type="submit" className={`${isLoading ?  'opacity-30':''} bg-indigo-600 text-white w-full p-2 rounded-lg text-xl font-bold focus:shadow-outline hover:bg-indigo-900`}>Add Product</button>
                                            </div>
                                            {/* End of Add Button */}
                                        </div>


                                    </div>
                                    {/*End of Side B*/}
                                </div>



                                <div className="hidden grid grid-cols-1 md:grid-cols-3">
                                    <div className="">
                                        {/* SignUp Button */}
                                        <div className="mb-5">
                                            <button className="bg-indigo-600 text-white w-full p-2 rounded-lg text-xl font-bold focus:shadow-outline hover:bg-indigo-900">Add Product</button>
                                        </div>
                                        {/* End of SignUp Button */}
                                    </div>
                                    <div className="">
                                    </div>
                                    <div className=""></div>

                                </div>



                            </form>

                        </div>
                    {/* end of reg form */}

                    {/* dummy */}
                    <div>

                    </div>
                    {/*end of dummy*/}
                </div>
            {/**/}
            </div>
        </Layout>
    );
}

export default AddPage;
