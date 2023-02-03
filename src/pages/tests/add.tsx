

import { useState } from 'react';
import { useRouter } from 'next/router';
import FullLogo from '@components/logo/full_logo';
import Link from 'next/link';

const AddPage = () => {
  const router = useRouter();

  return (
    <div>
    {/* container */}
        <div className="p-4">
            {/* registration form */}
                <div className="">
                    <form>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Side A */}
                            <div className="">
                                <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <span className="text-gray-700 mr-4 col-span-1">Product Type</span>
                                    <select
                                      className="col-span-3 p-2 focus:outline-none block w-full mt-1 border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      id="productType"
                                      name="productType">
                                      <option>Phone</option>
                                      <option>Laptop</option>
                                      <option>Desktop</option>
                                    </select>
                                </label>

                                <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <span className="text-gray-700 mr-4 col-span-1">Product Name</span>
                                    <input
                                      id="productName"
                                      type="text"
                                      placeholder="Samsung Galaxy s10"
                                      className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      required
                                    />
                                </label>

                                <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <span className="text-gray-700 mr-4 col-span-1">Manufacturer</span>
                                    <input
                                      id="manufacturer"
                                      type="text"
                                      placeholder="e.g Samsung, Dell, Apple ... "
                                      className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      required
                                    />
                                </label>

                                <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <span className="text-gray-700 mr-4 col-span-1">Price</span>
                                    <input
                                      id="manufacturer"
                                      type="number"
                                      placeholder="e.g 1500 "
                                      className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      required
                                    />
                                </label>

                                <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <span className="text-gray-700 mr-4 col-span-1">Currency</span>
                                    <input
                                      id="manufacturer"
                                      type="text"
                                      placeholder="e.g USD, DA, EURO"
                                      className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      required
                                    />
                                </label>


                                <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <span className="text-gray-700 mr-4 col-span-1">Product Description</span>
                                    <textarea
                                      rows={3}
                                      id="description"
                                      placeholder="please add as much details as possible"
                                      className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      required
                                    />
                                </label>

                            </div>
                            {/* end of Side A*/}


                            {/* Side B */}
                            <div className="ml-3 px-2 border-l-2 border-l-slate-100">
                                <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <span className="text-gray-700 mr-4 col-span-1">Condition</span>
                                    <select
                                      className="col-span-3 p-2 focus:outline-none block w-full mt-1 border-2 border-gray-200 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      id="condition"
                                      name="condition">
                                      <option>New</option>
                                      <option>Used</option>
                                    </select>
                                </label>

                                <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <span className="text-gray-700 mr-4 col-span-1">Quantity</span>
                                    <input
                                      id="quantity"
                                      type="number"
                                      placeholder="e.g 4"
                                      className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      required
                                    />
                                </label>

                                <label className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <span className="text-gray-700 mr-4 col-span-1">Product Image</span>
                                    <input
                                      id="mainImage"
                                      name="mainImage"
                                      type="file"
                                      placeholder="e.g Samsung, Dell, Apple ... "
                                      className="col-span-3 focus:outline-none w-full block mt-1 border border-gray-300 rounded-md p-2 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                      required
                                    />
                                </label>


                                <div className="grid grid-cols-2 md:grid-cols-4 justify-center items-center mb-5">
                                    <div></div>
                                    {/* SignUp Button */}
                                    <div className="mt-5 col-span-3 ">
                                        <button type="submit" className="bg-indigo-600 text-white w-full p-2 rounded-lg text-xl font-bold focus:shadow-outline hover:bg-indigo-900">Add Product</button>
                                    </div>
                                    {/* End of SignUp Button */}
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
  );
};

export default AddPage;
