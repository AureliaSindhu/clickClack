"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "./modal";
import "../app/style.css";
import twoByTwo from "../public/img/2by2(illust).png";
import oneByFour from "../public/img/1by4(illust).png";
import specialEd from "../public/special-ed/news1-thumb.png";

export default function Option() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    const handleTwoByTwoClick = () => {
        router.push('/capture/twoByTwo');
    };

    const handleOneByFourClick = () => {
        // router.push('/capture/oneByFour');
        setShowModal(true);
    };

    const handleSpecialEdClick = () => {
        router.push('/capture/specialEd');
    };

    return (
        <div className="flex flex-col items-center justify-center mt-auto mb-auto">
            <h1 className="text-center text-2xl font-chillax text-black mb-6">Choose Your Frame</h1>
            
            <div className="grid grid-cols-2 gap-8">
                {/* 2x2 Frame */}
                <div 
                    className="group relative flex flex-col items-center p-0 rounded-md h-50 transform transition-transform duration-300 hover:scale-105 hover:rotate-[2deg] border border-transparent hover:border-2 hover:border-[var(--canvas-dark)]"
                    onClick={handleTwoByTwoClick}
                >
                    <div className="relative flex flex-col items-center bg-[var(--canvas-light)] p-5 rounded-md z-10 h-full">
                        <Image 
                            src={twoByTwo} 
                            alt="2x2 Frame" 
                            height={100} 
                            className="mb-4 object-cover"
                        />
                        <span className="text-sm font-medium font-chillax text-black">2x2 Frame</span>
                    </div>
                </div>
                
                {/* 1x4 Frame */}
                <div 
                    className="group relative flex flex-col items-center p-0 rounded-md h-50 transform transition-transform duration-300 hover:scale-105 hover:rotate-[2deg] border border-transparent hover:border-2 hover:border-[var(--canvas-dark)]"
                    onClick={handleOneByFourClick}
                >
                    <div className="relative flex flex-col items-center bg-[var(--canvas-light)] p-5 rounded-md z-10 h-full">
                        <Image 
                            src={oneByFour} 
                            alt="1x4 Frame" 
                            height={100} 
                            className="mb-4 object-cover"
                        />
                        <span className="text-sm font-medium font-chillax text-black">1x4 Frame</span>
                    </div>
                </div>
                
                {/* Special Ed Frame */}
                <div className="col-span-2 flex justify-center">
                    <div 
                        className="group relative flex flex-col items-center p-0 rounded-md h-50 transform transition-transform duration-300 hover:scale-105 hover:rotate-[2deg] border border-transparent hover:border-2 hover:border-[var(--canvas-dark)]"
                        onClick={handleSpecialEdClick}
                    >
                        <div className="relative flex flex-col items-center bg-[var(--canvas-light)] p-5 rounded-md z-10 h-full">
                            <Image 
                                src={specialEd} 
                                alt="Special Ed Frame" 
                                height={100} 
                                className="mb-4 object-cover"
                            />
                            <span className="text-sm font-medium font-chillax text-black">Special Ed Frame</span>
                        </div>
                    </div>
                </div>
            </div>
            
            {showModal && <Modal message="COMING SOON" onClose={() => setShowModal(false)} />}
        </div>
    );
}
