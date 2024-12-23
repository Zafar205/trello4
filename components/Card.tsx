"use client"
import { useState, useContext } from 'react';



export default function Card({ title, description }: { title: string, description: string }) {

    const deleteCard = () => {
    };


    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    return (
        <div>
            <div className="bg-gray-200 h-[250px] w-[180px] mt-[50px] ml-[20px] rounded-2xl">
                <div className="flex justify-between pt-[10px]">
                    <h3 className="pl-[50px]">{title}</h3>
                    <div className="relative">
                        <img src="./dots.png" alt="not" height={"10px"} width={"25px"} onClick={toggleOptions} />
                        {showOptions && (
                            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg ">
                                <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ml-[40px]" onClick={deleteCard}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-center pt-6">
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}