"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "../../components/modal";
import Footer from "../../components/footer";
import "../style.css";

// Import images for each frame option
import twoByTwo from "../../public/img/2by2(illust).png";
import oneByFour from "../../public/img/1by4(illust).png";
import specialEd from "../../public/special-ed/news1-thumb.png";

export default function Option() {
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);

    // Define your frame options in an array
    const frameOptions = [
        {
        name: "2x2 Frame",
        type: "twoByTwo",
        image: twoByTwo,
        available: true,
        },
        {
        name: "1x4 Frame",
        type: "oneByFour",
        image: oneByFour,
        // Set available to false if you want this to show a modal,
        // or true if it should navigate to capture mode.
        available: true,
        },
        {
        name: "Special Edition",
        type: "specialEd",
        image: specialEd,
        available: true,
        },
    ];

    // Single click handler for all options.
    // It either navigates to the capture page with the appropriate collage type
    // or shows a modal if the option isn’t available.
    const handleOptionClick = (option: { type: string; available: boolean }) => {
        if (option.available) {
        router.push(`/capture/${option.type}`);
        } else {
        setShowModal(true);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--canvas)] p-10">
        <h1 className="text-2xl font-chillax text-black mb-6">Choose Your Frame</h1>
        <div className="flex space-x-8">
            {frameOptions.map((option, index) => (
            <div
                key={index}
                className="group relative flex flex-col items-center p-0 rounded-md h-80 transform transition-transform duration-300 hover:scale-105 hover:rotate-[2deg]"
                onClick={() => handleOptionClick(option)}
            >
                {/* Canvas-Dark Background */}
                <div className="absolute inset-0 bg-[var(--canvas-dark)] rounded-md transform transition-transform duration-300 group-hover:rotate-[-2deg] z-0"></div>

                {/* Canvas-Light Content */}
                <div className="relative flex flex-col items-center bg-[var(--canvas-light)] p-5 rounded-md z-10 h-full">
                <Image
                    src={option.image}
                    alt={option.name}
                    height={200}
                    className="mb-4 object-cover"
                />
                <span className="text-sm font-medium font-chillax text-black">
                    {option.name}
                </span>
                </div>
            </div>
            ))}
        </div>
        {showModal && <Modal message="COMING SOON" onClose={() => setShowModal(false)} />}
        <Footer />
        </div>
    );
}
