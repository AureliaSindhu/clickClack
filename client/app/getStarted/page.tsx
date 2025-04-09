"use client";

import '../style.css';
import { NavPages } from "../../components/navPages";
import Notifs from "../../components/notif";
import { Footer } from "../../components/footer";

export default function GetStarted() { 
    return (
        <div className="min-h-screen bg-[var(--canvas)] flex flex-col">
            <NavPages />
            <Notifs />
            <div className="absolute bottom-0 w-full"> <Footer /> </div>
        </div>
    );
}
