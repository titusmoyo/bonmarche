export const UserModel={
    fullName:'', //***** e.g Titus Moyo
    dateCreated:'',  // string   () e.g 697328736237
    photoURL:'',  //string   () e.g https:www.hero.jpeg
    phoneNumber:'',  // string  () e.g +27176276373
    uid:'',    // string  () e.g
    email:'',   //string  e.g
    emailVerified:false,  //boolean () e.g
    phoneNumberVerified:false,  //boolean () e.g
    userBlocked:false, // boolean
    threatLevel:0, // int
};


export interface JOBSTATUSMODEL{
    jobType:number, // int   6: , 7:google sign
    jobCaller:number, // int jobCaller indicates the jobType behind the job
    jobName:string,
    jobDescription:string,
    error:boolean,
    errorMessage:string,
    finished:boolean,
    output:string,
    other:boolean,
    otherMessage:string,
    isNewUser:boolean, // google auth signup and login indicator
};


// for all network related tasks
// 1 : realtime database operations
// 2 : storage operations
export const jobStatusModel={
    jobType:-1, // int   6: , 7:google sign
    jobCaller:-1, // int jobCaller indicates the jobType behind the job
    jobName:'',
    jobDescription:'',
    error:false,
    errorMessage:'',
    finished:false,
    output:'',
    other:false,
    otherMessage:'',
    isNewUser:false, // google auth signup and login indicator
};


/*  product model Here */
export interface PRODUCTMODEL{
    productId:string,
    productType:string,
    productName:string,
    manufacturer:string,
    price:number,
    currency:string,
    quantity:number,
    condition:string,
    mainImageUrl:any,
    description:string,
    sellerId:string,
    dateCreated:any,
};
