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

    // Scaling parameters (for preview)
    const SCALE_FACTOR = 0.3;

    // Original dimensions (same as FramePage)
    const ORIGINAL_WIDTH = 1080;
    const ORIGINAL_HEIGHT = 1920;
    const ORIGINAL_TOP_HEIGHT = 75; 
    const ORIGINAL_BOTTOM_HEIGHT = 421; 

    // Scaled dimensions (for preview)
    const SCALED_TOP_HEIGHT = Math.round(ORIGINAL_TOP_HEIGHT * SCALE_FACTOR); //22px
    const SCALED_BOTTOM_HEIGHT = Math.round(ORIGINAL_BOTTOM_HEIGHT * SCALE_FACTOR); //127px
    const SCALED_FRAME_WIDTH = Math.round(ORIGINAL_WIDTH * SCALE_FACTOR); //324px
    const SCALED_FRAME_HEIGHT = Math.round(ORIGINAL_HEIGHT * SCALE_FACTOR); //576px

    // Photo grid dimensions (for preview)
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

    const generateFinalImage = async () => {
        if (finalRef.current) {
            // Temporarily reset photo sizes to their original scale
            const originalPhotoSizes = photos.map(() => ({
                width: PHOTO_WIDTH / SCALE_FACTOR,
                height: PHOTO_HEIGHT / SCALE_FACTOR,
            }));

            // Temporarily set photos back to their original sizes (without scaling) before capturing the canvas
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
                // Generate canvas at the original resolution (1080x1920) without scaling
                const canvas = await html2canvas(finalRef.current, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "transparent",
                    scale: 1, // Set to 1 for actual size (no scaling)
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

    // New method to generate the full-size image with frame for download
    const handleDownload = () => {
        if (finalRef.current && selectedFrame) {
            const hiddenCanvas = document.createElement("canvas");
            const ctx = hiddenCanvas.getContext("2d");

            // Set the hidden canvas size to the original size (1080x1920)
            hiddenCanvas.width = ORIGINAL_WIDTH;
            hiddenCanvas.height = ORIGINAL_HEIGHT;

            if (ctx) {
                // Clear any previous content
                ctx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);

                // Draw the selected frame and photos at the full resolution
                ctx.fillStyle = selectedFrame.type === "color" ? selectedFrame.src : "transparent";
                ctx.fillRect(0, 0, hiddenCanvas.width, ORIGINAL_TOP_HEIGHT); // Top border
                ctx.fillRect(0, ORIGINAL_HEIGHT - ORIGINAL_BOTTOM_HEIGHT, hiddenCanvas.width, ORIGINAL_BOTTOM_HEIGHT); // Bottom border

                // Draw the photos on the canvas (adjust as necessary for positions)
                photos.forEach((photo, index) => {
                    const x = (index % 2) * (461); // Set positions of photos horizontally (split in two columns)
                    const y = Math.floor(index / 2) * (698); // Set positions vertically

                    const img = new Image();
                    img.src = photo;
                    img.onload = () => {
                        ctx.drawImage(img, x, y, 461, 698); // Draw photo at original size
                    };
                });

                // Draw the frame
                const frameImg = new Image();
                frameImg.src = selectedFrame.src;
                frameImg.onload = () => {
                    ctx.drawImage(frameImg, 0, 0, hiddenCanvas.width, hiddenCanvas.height); // Draw frame over the image

                    // After everything is drawn, create the download link
                    const imageUrl = hiddenCanvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = imageUrl;
                    link.download = "final-image.png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
            }
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
                            (e.target as HTMLImageElement).style.visibility = "hidden";
                        }}
                    />
                )}
            </div>

            {/* Download Button */}
            <button
                onClick={handleDownload}
                className="bg-blue-500 text-white py-2 px-4 rounded"
            >
                Download Full-size Image
            </button>
        </div>
    );
}
