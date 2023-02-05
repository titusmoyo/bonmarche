import { useState } from 'react';
import { useRouter } from 'next/router';
import FullLogo from '@components/logo/full_logo';
import Link from 'next/link';
import axios from 'axios';
import { publicKey } from '@utils/rsa_keys/keys';
const NodeRSA = require('node-rsa');

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

        // RSA encryption
        doRSAEncryption(values);
    }//end of handleSubmitData


    const doRSAEncryption = async (objectData:any)=>{
        //const key = new NodeRSA({b: 512});
        const key = new NodeRSA(publicKey);
        const encrypted = key.encrypt(JSON.stringify(objectData), 'base64');
        console.log('encrypted: ', encrypted);

        const response = await fetch("/api/payments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data:encrypted }),
        });

        const data = await response.json();
        console.log(data);
        console.log("results back")
    }

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
