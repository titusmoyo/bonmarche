
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ReactNode } from "react";
import { useAuth } from '@contexts/auth';
import { signOutUser } from '@lib/firebase_db/firebase_auth';
import {HOME_PAGE_INDEX,SIGNUP_PAGE_INDEX,LOGIN_PAGE_INDEX} from '@utils/constants/layout_constants';
import SymbolLogo from '@components/logo/symbol_logo';
import LabelLogo from '@components/logo/label_logo';
import { useState } from 'react';
import { USER_DROPDOWN_SETTINGS } from '@utils/constants/layout_constants';
import { USER_DROPDOWN_SIGNOUT } from '@utils/constants/layout_constants';
import  CartValuesComponent  from '@components/layout/valuescomponent';
import React from 'react';

// Create the Context object
// const LayoutContext = React.createContext();

const Layout = ({ children,childType }:{ children: ReactNode,childType:number}) => {
    const {user,dbuser} = useAuth();
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showHamburgerOptions, setShowHamburgerOptions] = useState(false);
    const [ cartCount,setCartCount ] = useState(0);

    const [values, setValues] = useState({
      searchQuery:'',
      userFirstName:'',
    });

    if(dbuser){
        values.userFirstName=dbuser['fullName'];
        values.userFirstName=values.userFirstName.split(" ")[0];
    }

    /* handles changes in the search field*/
    const handleChange = (e: { target: { id: any; value: any; }; }) => {
      const id = e.target.id;
      const newValue = e.target.value;
      setValues({ ...values, [id]: newValue });
    };

    const handleSearchQuery = async()=>{
        let fq:string = values.searchQuery.trim();
        if(fq.length===0 || fq===null || fq===undefined){
            return;
        }
        console.log("handleSubmit => handleSearchQuery");
        console.log("q : "+values.searchQuery);
    }

     /* Complete Code */
     const onUserDropDownItemClicked=async(index:number)=>{
         if(index===USER_DROPDOWN_SETTINGS){
             // settings clicked
             console.log("USER_DROPDOWN_SETTINGS");
         }else if(index===USER_DROPDOWN_SIGNOUT){
             // SignOut Clicked
             //console.log("USER_DROPDOWN_SIGNOUT");
             signOutUser();
         }else{
             console.log("else : USER_DROPDOWN");
         }
     }

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-1">
        {/*Eevrythin goes below*/}
        <Head>
            <title>Bon Marche E-commerce</title>
            <meta name="description" content="the ultimate online ide and coding assistant" />
        </Head>

        <CartValuesComponent setCartCount={setCartCount} />

        {/*Nav Bar*/}
        <nav className="">

            {/* Upper Nav*/}
            <div className="flex justify-between md:py-2 max-w-7xl mx-auto">
                {/*Left Side*/}
                <div className="flex items-center md:space-x-4">

                    <Link
                        onMouseOver={()=>{setShowUserDropdown(false);setShowHamburgerOptions(false)}}
                        href="/" className="hidden md:block">
                        <SymbolLogo h={60} w={60} />
                    </Link>

                    <Link
                        onMouseOver={()=>{setShowUserDropdown(false);setShowHamburgerOptions(false)}}
                        href="/">
                        <LabelLogo h={40} w={110}/>
                    </Link>


                    {/* Seach Box */}
                    <div className="hidden md:block">
                        <div className="flex border-2 border-2-slate-300 rounded-md items-center justify-center">

                            <input
                                id="searchQuery"
                                name="searchQuery"
                                type="text"
                                value={values.searchQuery}
                                onChange={handleChange}
                                className="focus:outline-none p-1 px-3 w-[400px]"
                                placeholder="Search Market"/>

                            <svg
                                onClick={()=>{handleSearchQuery();}}
                                className="w-6 h-6 mr-2 text-slate-500 hover:cursor-pointer"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>

                        </div>

                    </div>
                    {/*End of Search Box*/}
                </div>


                {/*Right Side*/}
                <div className="flex items-center justify-center space-x-5 text-green-600">
                    {/* Conditional Buttons*/
                        user ?
                        (
                            <div className="">
                                {/* Helper Methods (Small Devices ) */}
                                <div className="">
                                    <div className="">

                                    <div className="inline-flex bg-white rounded-md">
                                                {/* Hello, user button */}
                                                <div
                                                    onClick={()=>{setShowUserDropdown(!showUserDropdown);setShowHamburgerOptions(false);}}
                                                    className="flex flex-col space-y-0 items-center justify-center hover:cursor-pointer">

                                                    <svg className="w-6 h-6 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                    </svg>

                                                    <div className="flex items-center justify-center">
                                                        <div
                                                            className="pl-2 pr-1 text-sm text-gray-600 hover:text-gray-700 rounded-l-md">
                                                            Hello, {values.userFirstName}
                                                        </div>
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="w-4 h-4 text-slate-900"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M19 9l-7 7-7-7"
                                                            />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {/* End of Hello, user button */}


                                                <div className="relative">
                                                    <div  className={`${showUserDropdown ? 'block':'hidden'} top-12 absolute right-0 z-10 w-56 mt-4 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg`}>
                                                        <div className="p-2">
                                                            <div
                                                                onClick={()=>{
                                                                    // close dropdown
                                                                    setShowUserDropdown(!showUserDropdown);
                                                                    // Go to settings
                                                                    onUserDropDownItemClicked(USER_DROPDOWN_SETTINGS);
                                                                }}
                                                                className="flex space-x-2 items-center border-b-2 border-b-slate-200 block px-4 py-2 text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                                                            >
                                                                <div>
                                                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z" />
                                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    </svg>
                                                                </div>
                                                                <span>
                                                                    Settings
                                                                </span>
                                                            </div>

                                                            <div
                                                            onClick={()=>{
                                                                // close dropdown
                                                                setShowUserDropdown(!showUserDropdown);
                                                                // Sign out
                                                                onUserDropDownItemClicked(USER_DROPDOWN_SIGNOUT);
                                                            }}
                                                                className="flex space-x-2 items-center block px-4 py-2 text-sm text-gray-500  hover:bg-red-600 hover:text-white hover:cursor-pointer"
                                                            >
                                                                <div>
                                                                    <svg  className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                                                                    </svg>
                                                                </div>

                                                                <span className="">
                                                                Sign Out
                                                                </span>
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                </div>{/* HEND OF Small Devices ) */}
                            </div>
                        ):
                        (
                            <div
                                   /* SignIn Button :: only shows when is not logged in*/
                                   onMouseOver={()=>{setShowUserDropdown(false)}}
                                   className="hover:cursor-pointer text-xl font-medium">
                                   <Link href="/auth/login">
                                     SignIn
                                   </Link>
                              </div>
                        )
                    }



                    {/*Sell Stuff : hides on mobile*/}
                    <Link href="/action/add">
                        <div
                            onMouseOver={()=>{setShowUserDropdown(false)}}
                            className="hidden md:block border px-4 py-1 rounded-full border-green-600 hover:cursor-pointer">
                              Sell Something
                        </div>
                    </Link>

                    {/*Shpping Cart*/}
                    {/*
                        Place a badge that show notification numbers or number of items in a cart at top right of an icon with tailwindcss
                        icon-with-badge-tailwind.html
                    */}
                    <div className="">
                        <Link href="/action/cart">
                            <button className="py-4 px-1 relative border-2 border-transparent text-gray-800 rounded-full hover:text-gray-400 focus:outline-none focus:text-gray-500 transition duration-150 ease-in-out">
                              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                              </svg>
                              <span className="absolute inset-0 object-right-top -mr-6">
                                <div className="inline-flex items-center px-1.5 py-0.5 border-2 border-white rounded-full text-xs font-semibold leading-4 bg-red-500 text-white">
                                  {cartCount}
                                </div>
                              </span>
                            </button>
                        </Link>
                    </div>
                    {/* End of Cart */}


                    {/*Hamburger menu  menu : only shows up on mobile phones*/}
                    <div
                        onClick={()=>{setShowHamburgerOptions(!showHamburgerOptions); setShowUserDropdown(false);}}
                        className="block md:hidden text-black hover:cursor-pointer">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                    {/*Oend of menu*/}

                </div>
            </div>

            {/*Lower Nav : only for mobile Phones*/}
            <div className={`${showHamburgerOptions ? 'block':'hidden'} md:hidden max-w-7xl mx-auto`}>

               {/* Seach Box */}
                <div className="">
                    <div className="flex border-2 border-2-slate-300 rounded-md items-center">

                        <input
                            id="searchQuery"
                            name="searchQuery"
                            type="text"
                            value={values.searchQuery}
                            onChange={handleChange}
                            className="focus:outline-none p-1 px-3 w-full"
                            placeholder="Search Market"/>

                        <svg
                            onClick={()=>{handleSearchQuery();}}
                            className="w-6 h-6 mr-2 text-slate-500 hover:cursor-pointer"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>

                    </div>
                 </div>
                {/*End of Search Box*/}

                {/*Sell Stuff : hides on mobile*/}
                <Link href="/action/add">
                    <div
                        onMouseOver={()=>{setShowUserDropdown(false)}}
                        className="mt-3 border px-4 py-1 rounded-md border-green-600 hover:cursor-pointer flex items-center justify-center">

                          Sell Something
                    </div>
                </Link>

            </div>


        </nav>
        {/*End of Nav Bar*/}

        <main>{children}</main>

        {/*pass the props to childred*/}
        {/*end of children*/}

    </div>
  );
};

export default Layout;
