"use client";

import { useRouter } from "next/navigation";
import '../style.css';
import { useState } from 'react';
import { Camera, ImageIcon, Palette, Share2, X } from 'lucide-react'
import Image from 'next/image';
import Footer from "../../components/footer";

export default function getStarted(){
    const router = useRouter()
    const [notifications, setNotifications] = useState([
        { id: 1, title: "Choose your frame format", icon: Camera, color: "bg-[var(--slate)]" },
        { id: 2, title: "Capture your pictures", icon: ImageIcon, color: "bg-[var(--slate)]" },
        { id: 3, title: "Choose your frame style", icon: Palette, color: "bg-[var(--slate)]" },
        ])
        
        const chooseFrame = () => {
        router.push("/option")
        }
    
        const closeNotification = (id: number) => {
        setNotifications(notifications.filter(notif => notif.id !== id))
        }
    
    return (
        <div className="min-h-screen bg-[var(--canvas)] flex items-center justify-center p-4">
            <div className="max-w-sm w-full space-y-4">
                <div className="p-4 text-black text-center">
                    <h1 className="text-2xl font-semibold font-chillax">ClickClack</h1>
                    <p className="text-sm opacity-75">3 new notifications</p>
                </div>
                {notifications.map((notif, index) => (
                <div key={notif.id} className="rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex items-center p-4 bg-[var(--charcoal)] bg-opacity-80 relative">
                    <div className={`flex-shrink-0 h-10 w-10 rounded-full ${notif.color} flex items-center justify-center`}>
                        <notif.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-grow">
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-gray-400">Step {index + 1} of 3</p>
                    </div>
                    <button 
                        onClick={() => closeNotification(notif.id)} 
                        className="absolute top-2 right-2 text-gray-400 hover:text-white"
                        aria-label="Close notification"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    </div>
                </div>
                ))}
                <button 
                onClick={chooseFrame}
                className="w-full bg-[#356c47] text-white py-3 px-4 rounded-full hover:bg-[#536659] transition-colors font-semibold flex items-center justify-center"
                >
                    <Share2 className="mr-2 h-5 w-5" />
                        START CREATING
                    </button>
                <p className="text-center text-sm text-gray-600">
                    Don't forget to tag 
                    <span className="font-semibold">
                        <a href="https://instagram.com/aacode" target="_blank"> @aacode</a>
                    </span> on Instagram when sharing!
                </p>
            </div>
            <Footer/>
        </div>
    );
}
