"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";

interface Frame {
    id: string;
    type: "color" | "custom";
    src: string;
    name: string;
}

export default function FinalizePage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
    const [finalImage, setFinalImage] = useState<string>("");

    const finalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load photos from sessionStorage
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        } else {
            router.push("/capture");
        }

        // Load selected frame from sessionStorage
        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        if (storedSelectedFrame) {
            setSelectedFrame(JSON.parse(storedSelectedFrame));
        } else {
            router.push("/frame");
        }
    }, [router]);

    useEffect(() => {
        if (photos.length > 0 && selectedFrame) {
            generateFinalImage();
        }
    }, [photos, selectedFrame]);

    const generateFinalImage = async () => {
        if (finalRef.current) {
            try {
                const canvas = await html2canvas(finalRef.current, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "white",
                    scale: 2 // Increase quality
                });
                const dataURL = canvas.toDataURL("image/png");
                setFinalImage(dataURL);
            } catch (error) {
                console.error("Error generating final image:", error);
            }
        }
    };

    const handleDownload = () => {
        if (finalImage) {
            const link = document.createElement("a");
            link.href = finalImage;
            link.download = "photo_booth.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-6">Your Final Photo</h1>

            {/* Frame and Photos Container */}
            <div
                ref={finalRef}
                className="relative flex flex-col items-center justify-center mb-8 bg-white"
                style={{
                    width: "400px",
                    height: "400px",
                    backgroundColor: selectedFrame?.type === "color" ? selectedFrame.src : "white"
                }}
            >
                {selectedFrame?.type === "custom" && (
                    <img
                        src={selectedFrame.src}
                        alt={`Frame ${selectedFrame.name}`}
                        className="absolute top-0 left-0 w-full h-full object-contain"
                    />
                )}

                <div
                    className="grid grid-cols-2 gap-4"
                    style={{
                        width: "320px",
                        height: "320px",
                        zIndex: 1
                    }}
                >
                    {photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-40 h-40 object-cover rounded-md"
                        />
                    ))}
                </div>
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
            >
                Download Photo
            </button>
        </div>
    );
}
