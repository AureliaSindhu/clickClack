"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import '../style.css';

interface Frame {
    id: string;
    type: "color" | "custom";
    src: string;
    name: string;
}

// Original dimensions
const ORIGINAL_WIDTH = 1080;
const ORIGINAL_HEIGHT = 1920;
const PREVIEW_SCALE = 0.7;

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
                // Create a temporary div with original dimensions
                const tempDiv = document.createElement('div');
                tempDiv.style.width = `${ORIGINAL_WIDTH}px`;
                tempDiv.style.height = `${ORIGINAL_HEIGHT}px`;
                tempDiv.style.position = 'absolute';
                tempDiv.style.left = '-9999px';
                tempDiv.style.backgroundColor = selectedFrame?.type === "color" ? selectedFrame.src : "white";
                
                // Clone the content
                const content = finalRef.current.cloneNode(true) as HTMLElement;
                content.style.transform = 'none';
                content.style.width = `${ORIGINAL_WIDTH}px`;
                content.style.height = `${ORIGINAL_HEIGHT}px`;
                
                // Update photo grid dimensions
                const photoGrid = content.querySelector('.grid') as HTMLElement;
                if (photoGrid) {
                    photoGrid.style.width = `${950}px`;
                    photoGrid.style.height = `${1424}px`;
                }
                
                // Update individual photo dimensions
                const photos = content.querySelectorAll('.grid img');
                photos.forEach(photo => {
                    const img = photo as HTMLElement;
                    img.style.width = `${461}px`;
                    img.style.height = `${698}px`;
                });
                
                tempDiv.appendChild(content);
                document.body.appendChild(tempDiv);

                const canvas = await html2canvas(tempDiv, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: null,
                    scale: 1,
                    width: ORIGINAL_WIDTH,
                    height: ORIGINAL_HEIGHT
                });

                document.body.removeChild(tempDiv);
                
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
            link.download = "clickclack.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] p-6 text-black">
            <h1 className="text-2xl font-bold mb-6">Your Final Photo</h1>

            {/* Frame and Photos Container */}
            <div
                ref={finalRef}
                className="relative flex flex-col items-center justify-center mb-8 bg-white"
                style={{
                    width: `${ORIGINAL_WIDTH * PREVIEW_SCALE}px`,
                    height: `${ORIGINAL_HEIGHT * PREVIEW_SCALE}px`,
                    backgroundColor: selectedFrame?.type === "color" ? selectedFrame.src : "white",
                    position: "relative",
                }}
            >
                {selectedFrame?.type === "custom" && (
                    <img
                        src={selectedFrame.src}
                        alt={`Frame ${selectedFrame.name}`}
                        className="absolute top-0 left-0 w-full h-full object-contain"
                        style={{ zIndex: 2 }}
                    />
                )}

                {/* Photo grid container */}
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 gap-7"
                    style={{
                        width: `${950 * PREVIEW_SCALE}px`,
                        height: `${1424 * PREVIEW_SCALE}px`,
                        zIndex: 1,
                    }}
                >
                    {photos.map((photo, index) => (
                        <img
                            key={index}
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="object-cover rounded-md"
                            style={{
                                width: `${461 * PREVIEW_SCALE}px`,
                                height: `${698 * PREVIEW_SCALE}px`,
                            }}
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
