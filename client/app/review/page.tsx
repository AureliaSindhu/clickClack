"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer";

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
        const clearedPhotos = photos.map(() => "");
        setPhotos(clearedPhotos);
        sessionStorage.setItem("photos", JSON.stringify(clearedPhotos));
        // Redirect back to the capture page
        router.push("/capture");
    };

    const handleProceed = () => {
        router.push("/frame"); // Navigate to the frame selection page
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-6">Review Your Photos</h1>
            <div className="grid grid-cols-2 gap-4">
                {photos.map((photo, index) => (
                    <div key={index} className="flex flex-col items-center">
                        {photo ? (
                            <img
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="w-40 h-40 object-cover rounded-md mb-2"
                            />
                        ) : (
                            <div className="w-40 h-40 bg-gray-200 rounded-md flex items-center justify-center mb-2">
                                <p className="text-gray-500">Empty</p>
                            </div>
                        )}
                        {/* Optionally, you can remove individual Retake buttons
                            if you only want a single Retake All button below */}
                    </div>
                ))}
            </div>
            {/* Single Retake All Button */}
            <button
                onClick={handleRetakeAll}
                className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-lg shadow-lg hover:bg-yellow-600 transition"
            >
                Retake All Photos
            </button>
            <button
                onClick={handleProceed}
                className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition"
                disabled={photos.some((photo) => !photo)} // Disable if any photo is missing
            >
                Proceed to Frame Selection
            </button>
            <Footer />
        </div>
    );
}
