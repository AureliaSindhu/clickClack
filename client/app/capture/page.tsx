"use client";

import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import '../style.css';
import Footer from "../../components/footer";

export default function CapturePage() {
    const webcamRef = useRef<Webcam>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const router = useRouter();

    const capturePhoto = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                // Save the original captured image
                const updatedPhotos = [...photos, imageSrc];
                setPhotos(updatedPhotos);

                if (updatedPhotos.length === 4) {
                    sessionStorage.setItem("photos", JSON.stringify(updatedPhotos));
                    router.push("/review");
                }
            } else {
                console.error("Failed to capture screenshot");
            }
        } else {
            console.error("Webcam reference is not initialized");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--canvas)]">
            <h1 className="text-2xl mb-4 text-[var(--charcoal)] font-chillax">Capture Your Photos</h1>
            <div className="w-80 h-80 bg-[var(--charcoal)] rounded-lg overflow-hidden mb-4">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"  // Ensure the webcam feed is responsive and fills the container while maintaining the aspect ratio
                    videoConstraints={{
                        width: 1080,
                        height: 1920,
                        facingMode: "user",
                    }}
                />
            </div>
            <button
                onClick={capturePhoto}
                className="px-6 py-3 bg-[#536659] text-white rounded-lg shadow-lg hover:bg-[#356c47] transition"
                disabled={photos.length === 4}
            >
                {photos.length < 4 ? `Capture Photo ${photos.length + 1}` : "Completed"}
            </button>
            <p className="text-gray-500 mt-4">
                {photos.length}/4 photos captured
            </p>
            <Footer />
        </div>
    );
}
