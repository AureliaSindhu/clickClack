"use client";

import { useRouter } from "next/navigation";
import '../style.css';
import Image from 'next/image';
import logo from '../../public/img/clickclackLogo.png';
import Footer from '../../components/footer';

export default function HomePage() {
    const router = useRouter(); 

    const getStarted = () => {
        router.push("/getStarted");
    };

    return (
        <div className="flex flex-col min-h-screen bg-[var(--canvas)]">
            <div className="flex flex-col flex-grow items-center justify-center">
                <Image src={logo} alt="ClickClack Logo" width={150} height={150} className="mb-5"/>
                <h1 className="text-4xl font-bold mb-2 text-[var(--charcoal)] font-chillax">ClickClack</h1>
                <p className="text-md text-[var(--slate)] mb-4">
                    Capture fun and creative photos just like in a real photobooth!
                </p>
                <button
                    onClick={getStarted}
                    className="px-6 py-3 bg-[var(--charcoal)] text-white rounded-lg shadow-lg hover:bg-[var(--slate)] transition"
                >
                    Get Started
                </button>
            </div>
            <Footer/>
        </div>
    );
}
