import { useState } from 'react';
import { useRouter } from 'next/router';
import FullLogo from '@components/logo/full_logo';
import Link from 'next/link';
import axios from 'axios';
import EncryptRsa from 'encrypt-rsa';

const RSA = () =>{

    const [values, setValues]=useState({
        firstName:'',
        secondName:'',
    });


    const onChangeListener=(e: { target: { id: any; value: any; }; })=>{
        let id = e.target.id;
        let newValue = e.target.value;

        setValues({...values,[id]:newValue});

    }//end of onChangeListener


    const handleSubmitData=async (e: { preventDefault: () => void; })=>{
        e.preventDefault();

        if(values.firstName.length==0 || values.secondName.length===0){
            return;
        }

        console.log("handleSubmitData()");
        console.log(values);

        // create instance
        const encryptRsa = new EncryptRsa();
        //const { privateKey, publicKey } = encryptRsa.createPrivateAndPublicKeys();
        //const { privateKey, publicKey } =;
        const privateKey="asante_sane";
        const publicKey="holy";

        console.log("privateKey");
        console.log(privateKey);
        console.log("Public Key");
        console.log(publicKey);

        //const encryptedText = encryptRsa.encryptStringWithRsaPublicKey({text: 'hello world',publicKey,});

        let newV={
            firstName:encryptRsa.encryptStringWithRsaPublicKey({text: values.firstName,publicKey,}),
            secondName:encryptRsa.encryptStringWithRsaPublicKey({text:values.secondName,publicKey,})
        };



        const response = await fetch("/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ firstName:newV.firstName,secondName:newV.secondName }),
        });

        const data = await response.json();

        console.log(data);
        console.log("results back");


    }//end of handleSubmitData

    return(
        <div className="p-5">
            <div>Jobho</div>


            <form onSubmit={handleSubmitData} className="">
                {/**/}
                <div className="">
                    <label className="block">First Name</label>
                    <input
                        id="firstName"
                        name="firstName"
                        onChange={onChangeListener}
                        className="outline-none focus:outline-none mt-1 p-1 border-2 border-slate-100 rounded-md"
                        value={values.firstName}
                        placeholder="First Name"/>
                </div>

                {/**/}
                <div className="mt-3">
                    <label className="block">Second Name</label>
                    <input
                        id="secondName"
                        name="secondName"
                        onChange={onChangeListener}
                        className="outline-none focus:outline-none mt-1 p-1 border-2 border-slate-100 rounded-md"
                        value={values.secondName}
                        placeholder="Second Name"/>
                </div>

                <button className="mt-3 bg-cyan-300 p-2 w-[150px] rounded-md">Send data</button>

            </form>
        </div>
    );
}

export default RSA;
