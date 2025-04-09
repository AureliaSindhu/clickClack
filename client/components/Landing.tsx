"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../public/img/clickclackLogo.png";
import "../app/style.css";

export default function HomePage() {
    const router = useRouter();

    const getStarted = () => {
        router.push("/getStarted");
    };

    return (
        <div className="relative flex flex-col bg-[var(--canvas)] min-h-screen overflow-hidden">
            {/* <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-gradient-radial from-[var(--canvas-dark)] to-transparent rounded-full opacity-20" />
            <div className="absolute bottom-[-100px] left-[-100px] w-[300px] h-[300px] bg-gradient-radial from-[var(--canvas-darker)] to-transparent rounded-full opacity-20" /> */}

            <div className="relative z-10 flex flex-col flex-grow items-center justify-center px-4">
                <Image
                src={logo}
                alt="ClickClack Logo"
                width={150}
                height={150}
                className="mb-5 drop-shadow-lg"
                />
                <h1 className="text-5xl font-bold mb-2 text-[var(--charcoal)] font-chillax tracking-wide">
                ClickClack
                </h1>
                <p className="text-lg text-[var(--slate)] mb-6 text-center max-w-md">
                Capture fun and creative photos just like in a real photobooth!
                </p>
                <button
                onClick={getStarted}
                className="px-8 py-3 bg-[var(--charcoal)] text-white rounded-lg shadow-lg hover:bg-[var(--canvas-dark)] transition duration-300 transform hover:scale-105 focus:outline-none"
                >
                Get Started
                </button>
            </div>
        </div>
    );
}
