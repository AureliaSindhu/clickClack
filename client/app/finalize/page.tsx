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

export default function FinalizePage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
    const [finalImage, setFinalImage] = useState<string>("");

    const finalRef = useRef<HTMLDivElement>(null);

    // Scaling parameters (must match FramePage)
    const SCALE_FACTOR = 0.3;

    // Original dimensions (same as FramePage)
    const ORIGINAL_WIDTH = 1080;
    const ORIGINAL_HEIGHT = 1920;
    const ORIGINAL_TOP_HEIGHT = 75; 
    const ORIGINAL_BOTTOM_HEIGHT = 421; 

    // Scaled dimensions
    const SCALED_TOP_HEIGHT = Math.round(ORIGINAL_TOP_HEIGHT * SCALE_FACTOR); //22px
    const SCALED_BOTTOM_HEIGHT = Math.round(ORIGINAL_BOTTOM_HEIGHT * SCALE_FACTOR); //127px
    const SCALED_FRAME_WIDTH = Math.round(ORIGINAL_WIDTH * SCALE_FACTOR); //324px
    const SCALED_FRAME_HEIGHT = Math.round(ORIGINAL_HEIGHT * SCALE_FACTOR); //576px

    // Photo grid dimensions
    const PHOTO_WIDTH = Math.round(461 * SCALE_FACTOR); //138px
    const PHOTO_HEIGHT = Math.round(698 * SCALE_FACTOR); //210px
    const GAP_BETWEEN_PHOTOS = Math.round(30 * SCALE_FACTOR); //9px
    const LEFT_RIGHT_GAP = Math.round(65 * SCALE_FACTOR); //19px

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

    // const generateFinalImage = async () => {
    //     if (finalRef.current) {
    //         try {
    //             const canvas = await html2canvas(finalRef.current, {
    //                 useCORS: true,
    //                 allowTaint: true,
    //                 backgroundColor: "transparent",
    //                 scale: 2, 
    //                 width: ORIGINAL_WIDTH, // Use original width
    //                 height: ORIGINAL_HEIGHT, // Use original height
    //             });
    //             console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`); // Should log: 324x576
    //             const dataURL = canvas.toDataURL("image/png");
    //             setFinalImage(dataURL);
    //         } catch (error) {
    //             console.error("Error generating final image:", error);
    //         }
    //     }
    // };

    const generateFinalImage = async () => {
        if (finalRef.current) {
            // Temporarily set photos back to their original sizes
            const originalPhotoSizes = photos.map(() => ({
                width: PHOTO_WIDTH / SCALE_FACTOR,
                height: PHOTO_HEIGHT / SCALE_FACTOR
            }));
    
            // Temporarily modify photo sizes before capturing the canvas
            const updatedPhotos = photos.map((photo, index) => (
                <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="object-cover"
                    style={{
                        width: `${originalPhotoSizes[index].width}px`, // Set back to original size
                        height: `${originalPhotoSizes[index].height}px`, // Set back to original size
                    }}
                />
            ));
    
            try {
                // Generate canvas at the original resolution
                const canvas = await html2canvas(finalRef.current, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "transparent",
                    scale: 2, // Ensure higher resolution
                    width: ORIGINAL_WIDTH,
                    height: ORIGINAL_HEIGHT,
                });
    
                console.log(`Canvas dimensions: ${canvas.width}x${canvas.height}`); // Should log: 1080x1920
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
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] text-black p-6">
            <h1 className="text-2xl font-bold mb-6">Your Final Photo</h1>

            {/* Frame and Photos Container */}
            <div
                ref={finalRef}
                className="flex flex-col relative mb-8"
                style={{
                    width: `${SCALED_FRAME_WIDTH}px`, //324px
                    height: `${SCALED_FRAME_HEIGHT}px`, //576px
                    backgroundColor: "transparent",
                    position: "relative",
                }}
            >
                {/* Top Border */}
                <div
                    className="w-full"
                    style={{
                        height: `${SCALED_TOP_HEIGHT}px`, //22px
                        backgroundColor: selectedFrame?.type === "color" ? selectedFrame.src : "transparent",
                    }}
                ></div>

                {/* Photo Grid */}
                <div className="flex-grow flex justify-center items-center">
                    <div
                        className="grid grid-cols-2 gap-[9px]"
                        style={{
                            width: `${PHOTO_WIDTH * 2 + GAP_BETWEEN_PHOTOS}px`, //138*2 +9=285px
                            height: `${PHOTO_HEIGHT * 2 + GAP_BETWEEN_PHOTOS}px`, //210*2 +9=429px
                            marginLeft: `${LEFT_RIGHT_GAP}px`, //19px
                            marginRight: `${LEFT_RIGHT_GAP}px`, //19px
                        }}
                    >
                        {photos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="object-cover"
                                style={{
                                    width: `${PHOTO_WIDTH}px`, //138px
                                    height: `${PHOTO_HEIGHT}px`, //210px
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Bottom Border */}
                <div
                    className="w-full"
                    style={{
                        height: `${SCALED_BOTTOM_HEIGHT}px`, //127px
                        backgroundColor: selectedFrame?.type === "color" ? selectedFrame.src : "transparent",
                    }}
                ></div>

                {/* Frame Overlay */}
                {selectedFrame && (
                    <img
                        src={selectedFrame.src}
                        alt={`Frame ${selectedFrame.name}`}
                        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                        style={{ zIndex: 2 }}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/fallback-frame.png"; // Provide a fallback image
                        }}
                    />
                )}
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
