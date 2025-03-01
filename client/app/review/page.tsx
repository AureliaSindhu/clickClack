"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer";
import "../style.css";
import { RefreshCcw, ChevronRight } from "lucide-react"; 

export default function ReviewPage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);

    // Load photos from sessionStorage
    useEffect(() => {
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        } else {
            // If no photos are found, redirect back to the capture page
            router.push("/capture");
        }
    }, [router]);

    // Handle retake all photos
    const handleRetakeAll = () => {
        // Clear all photos
        setPhotos([]);
        sessionStorage.removeItem("photos");
        // Redirect back to the capture page
        router.push("/capture");
    };

    const handleProceed = () => {
        router.push("/frame"); // Navigate to the frame selection page
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--canvas)]">
            <div className="flex-grow flex flex-col items-center justify-center p-10">
                <h1 className="text-2xl mb-6 text-black font-chillax">Review Your Photos</h1>
                <div className="grid grid-cols-2 gap-4">
                    {photos.map((photo, index) => (
                        <div key={index} className="flex flex-col items-center">
                            {photo ? (
                                <img
                                    src={photo}
                                    alt={`Captured photo number ${index + 1}`}
                                    className="w-[138px] h-[209px] object-cover rounded-md mb-2"
                                    loading="lazy" // Enables lazy loading
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/fallback-image.png"; // Provide a fallback image path
                                    }}
                                />
                            ) : (
                                <div className="w-[138px] h-[209px] bg-gray-200 rounded-md flex items-center justify-center mb-2">
                                    <p className="text-gray-500">Empty</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={handleRetakeAll}
                        className="p-3 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-[#7f743e] transition flex items-center justify-center"
                    >
                        Retake <RefreshCcw className="ml-2" />
                    </button>
                    <button
                        onClick={handleProceed}
                        className="p-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-[#536659] transition flex items-center justify-center"
                        disabled={photos.length === 0}
                    >
                        Continue <ChevronRight className="ml-2" />
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}
