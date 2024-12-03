"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../style.css";
import twoByTwo from "../../public/img/2by2.png"
import oneByFour from "../../public/img/1by4.png"

export default function Option() {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--canvas)]">
            <h1 className="text-3xl font-chillax text-black mb-6">Choose Your Frame</h1>

            <div className="flex space-x-8">
                <div className="flex flex-col items-center bg-[var(--canvas-light)] p-10 rounded-md">
                    <Image 
                        src={twoByTwo} 
                        alt="2x2 Frame" 
                        // width={120} 
                        height={120} 
                        className="mb-4 object-cover"
                    />
                    <span className="text-xl font-medium text-black">2x2 Frame</span>
                </div>
                <div className="flex flex-col items-center bg-[var(--canvas-light)] p-10 rounded-md">
                    <Image 
                        src={oneByFour} 
                        alt="1x4 Frame" 
                        // width={120} 
                        height={120} 
                        className="mb-4 object-cover"
                    />
                    <span className="text-xl font-medium text-black">1x4 Frame</span>
                </div>
            </div>

        </div>
    );
}