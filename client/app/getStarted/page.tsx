"use client";

import '../style.css';
import { NavPages } from "../../components/navPages";
import Notifs from "../../components/notif";
import { Footer } from "../../components/footer";

export default function GetStarted() { 
    return (
        <div className="flex flex-col item-center justify-center h-screen bg-[var(--canvas)]">
            <NavPages />
            <Notifs />
            <Footer />
        </div>
    );
}
