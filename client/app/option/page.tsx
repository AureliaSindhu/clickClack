"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../style.css";
import twoByTwo from "../../public/img/2by2(illust).png"
import oneByFour from "../../public/img/1by4(illust).png"

export default function Option() {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--canvas)]">
            <h1 className="text-3xl font-chillax text-black mb-6">Choose Your Frame</h1>

            <div className="flex space-x-8">
                {/* 2x2 Frame */}
                <div className="group relative flex flex-col items-center p-0 rounded-md h-80 transform transition-transform duration-300 hover:scale-105 hover:rotate-[2deg]">
                    {/* Canvas-Dark Background */}
                    <div className="absolute inset-0 bg-[var(--canvas-dark)] rounded-md transform transition-transform duration-300 group-hover:rotate-[-2deg] z-0"></div>
                    
                    {/* Canvas-Light Content */}
                    <div className="relative flex flex-col items-center bg-[var(--canvas-light)] p-10 rounded-md z-10 h-full">
                    <Image 
                        src={twoByTwo} 
                        alt="2x2 Frame" 
                        height={200} 
                        className="mb-4 object-cover"
                    />
                    <span className="text-xl font-medium font-chillax text-black">2x2 Frame</span>
                    </div>
                </div>
                
                {/* 1x4 Frame */}
                <div className="group relative flex flex-col items-center p-0 rounded-md h-80 transform transition-transform duration-300 hover:scale-105 hover:-rotate-[2deg]">
                    {/* Canvas-Dark Background */}
                    <div className="absolute inset-0 bg-[var(--canvas-dark)] rounded-md transform transition-transform duration-300 group-hover:rotate-[2deg] z-0"></div>
                    
                    {/* Canvas-Light Content */}
                    <div className="relative flex flex-col items-center bg-[var(--canvas-light)] p-10 rounded-md z-10 h-full">
                    <Image 
                        src={oneByFour} 
                        alt="1x4 Frame" 
                        height={200} 
                        className="mb-4 object-cover"
                    />
                    <span className="text-xl font-medium font-chillax text-black">1x4 Frame</span>
                    </div>
                </div>
            </div>


        </div>
    );
}