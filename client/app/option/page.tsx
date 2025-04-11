"use client";

import { NavPages } from "../../components/navPages";
import OptionComponent from "../../components/option";
import { Footer } from "../../components/footer";

export default function Option() {
    return(
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--canvas)]">
            <NavPages />
            <OptionComponent />
            <div className="absolute bottom-0 w-full"> <Footer /> </div>
        </div>
    );
}
