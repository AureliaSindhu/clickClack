"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import '../style.css';
import Footer from "../../components/footer";

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

    // Original dimensions
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

    // Optional: You can keep this for generating a preview image if needed
    useEffect(() => {
        if (photos.length > 0 && selectedFrame) {
            generateFinalImage();
        }
    }, [photos, selectedFrame]);

    const generateFinalImage = async () => {
        if (finalRef.current) {
            try {
                // Generate canvas at the scaled resolution for preview
                const canvas = await html2canvas(finalRef.current, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "transparent",
                    scale: 1, // Set to 1 for actual size in preview
                });

                const dataURL = canvas.toDataURL("image/png");
                setFinalImage(dataURL);
            } catch (error) {
                console.error("Error generating final image:", error);
            }
        }
    };

    // Helper function to load images
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "anonymous"; // To avoid CORS issues
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };

    // Helper function to draw images with "object-cover" behavior
    const drawImageCover = (
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        dx: number,
        dy: number,
        dWidth: number,
        dHeight: number
    ) => {
        const imgAspect = img.width / img.height;
        const targetAspect = dWidth / dHeight;

        let sx: number, sy: number, sWidth: number, sHeight: number;

        if (imgAspect > targetAspect) {
            // Image is wider than target aspect ratio
            sHeight = img.height;
            sWidth = sHeight * targetAspect;
            sx = (img.width - sWidth) / 2;
            sy = 0;
        } else {
            // Image is taller than target aspect ratio
            sWidth = img.width;
            sHeight = sWidth / targetAspect;
            sx = 0;
            sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    };

    // Function to handle download of the full-size image
    const handleDownload = async () => {
        if (!selectedFrame || photos.length === 0) {
            alert("No frame or photos selected.");
            return;
        }

        try {
            // Create a canvas with original dimensions
            const canvas = document.createElement("canvas");
            canvas.width = ORIGINAL_WIDTH;
            canvas.height = ORIGINAL_HEIGHT;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Canvas is not supported.");
            }

            // Fill the background with transparent (optional)
            ctx.fillStyle = "rgba(0,0,0,0)";
            ctx.fillRect(0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

            // Load frame image
            const frameImg = await loadImage(selectedFrame.src);

            // Load and draw photos
            const loadedPhotos = await Promise.all(
                photos.slice(0, 4).map((photo) => loadImage(photo))
            );

            // Define positions based on original spacing
            const photoPositions = [
                { x: 65, y: 75 }, // Top-left photo
                { x: 65 + 461 + 30, y: 75 }, // Top-right photo
                { x: 65, y: 75 + 698 + 30 }, // Bottom-left photo
                { x: 65 + 461 + 30, y: 75 + 698 + 30 }, // Bottom-right photo
            ];

            // Draw each photo with aspect ratio preserved
            loadedPhotos.forEach((img, index) => {
                const pos = photoPositions[index];
                drawImageCover(ctx, img, pos.x, pos.y, 461, 698);
            });

            // Draw the frame on top
            ctx.drawImage(frameImg, 0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

            // Generate the data URL
            const dataURL = canvas.toDataURL("image/png");

            // Trigger the download
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "final-image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating full-size image:", error);
            alert("Failed to generate the image. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] text-black p-6">
            <h1 className="text-2xl mb-6 font-chillax">Your Final Photo</h1>

            {/* Frame and Photos Container (Scaled Preview) */}
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
                {/* Top Gap */}
                <div
                    className="w-full"
                    style={{
                        height: `${SCALED_TOP_HEIGHT}px`, //22px
                        backgroundColor: "transparent",
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
                        {photos.slice(0, 4).map((photo, index) => (
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

                {/* Bottom Gap */}
                <div
                    className="w-full"
                    style={{
                        height: `${SCALED_BOTTOM_HEIGHT}px`, //127px
                        backgroundColor: "transparent",
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
                className="bg-[#536659] text-white py-2 px-4 rounded-lg shadow-lg hover:bg-[#356c47] transition"
            >
                Download Image
            </button>
            <Footer />
        </div>
    );
}
