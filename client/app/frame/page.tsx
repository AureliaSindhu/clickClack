"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import '../style.css';

interface Frame {
    id: string;
    type: "color" | "custom";
    src: string; // URL of the frame image or color code
    name: string;
}

export default function FramePage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [frames, setFrames] = useState<Frame[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

    // Original dimensions
    const ORIGINAL_WIDTH = 1080;
    const ORIGINAL_HEIGHT = 1920;
    const SCALE_FACTOR = 0.3; // 30% of original size

    // Frame dimensions (Original dimensions before scaling)
    const ORIGINAL_TOP_HEIGHT = 75; 
    const ORIGINAL_BOTTOM_HEIGHT = 421; 

    // Scaled dimensions
    const SCALED_TOP_HEIGHT = Math.round(ORIGINAL_TOP_HEIGHT * SCALE_FACTOR); //75 *0.3=22px
    const SCALED_BOTTOM_HEIGHT = Math.round(ORIGINAL_BOTTOM_HEIGHT * SCALE_FACTOR); //421*0.3=127px
    const SCALED_FRAME_WIDTH = Math.round(ORIGINAL_WIDTH * SCALE_FACTOR); //1080*0.3=324px
    const SCALED_FRAME_HEIGHT = Math.round(ORIGINAL_HEIGHT * SCALE_FACTOR); //1920*0.3=576px

    // Photo grid dimensions
    const PHOTO_WIDTH = Math.round(461 * SCALE_FACTOR); //138px
    const PHOTO_HEIGHT = Math.floor(698 * SCALE_FACTOR); //209px
    const GAP_BETWEEN_PHOTOS = Math.round(30 * SCALE_FACTOR); //9px
    const LEFT_RIGHT_GAP = Math.round(65 * SCALE_FACTOR); //19px

    // Predefined color frames
    const colorFrames: Frame[] = [
        { id: "color-white", type: "color", src: "#FFFFFF", name: "White Border" },
        { id: "color-black", type: "color", src: "#000000", name: "Black Border" },
        { id: "color-gray", type: "color", src: "#808080", name: "Gray Border" },
        { id: "color-beige", type: "color", src: "#F5F5DC", name: "Beige Border" },
        // Add more color frames as needed
    ];

    // Predefined custom frames (ensure these images are in the /public/custom-frames/ directory)
    const customFrames: Frame[] = [
        { id: "custom1", type: "custom", src: "/frames/base.png", name: "Floral Frame" },
        { id: "custom2", type: "custom", src: "/custom-frames/custom-frame2.png", name: "Vintage Frame" },
        // Add more custom frames as needed
    ];

    useEffect(() => {
        // Load photos from sessionStorage
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        } else {
            // If no photos are found, redirect back to the capture page
            router.push("/capture");
        }

        // Initialize frames with color and custom frames
        setFrames([...colorFrames, ...customFrames]);

        // Load selected frame from sessionStorage or set default
        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        if (storedSelectedFrame) {
            setSelectedFrame(JSON.parse(storedSelectedFrame));
        } else {
            // Set default frame as white border
            setSelectedFrame(colorFrames[0]);
        }
    }, [router]);

    // Handle frame selection
    const handleSelectFrame = (frame: Frame) => {
        setSelectedFrame(frame);
        sessionStorage.setItem("selectedFrame", JSON.stringify(frame));
    };

    const handleProceed = () => {
        // Proceed to the next step/page
        router.push("/finalize"); // Update the route as needed
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] p-10 text-black">
            <h1 className="text-2xl font-bold mb-6">Select a Frame for Your Photos</h1>
            
            {/* Frame Canvas */}
            <div
                className="flex flex-col relative mb-8"
                style={{
                    width: `${SCALED_FRAME_WIDTH}px`, //324px
                    height: `${SCALED_FRAME_HEIGHT}px`, //576px
                    backgroundColor: selectedFrame?.type === "color" ? selectedFrame.src : "transparent",
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
                <div
                    className="flex-grow flex justify-center items-center"
                >
                    <div
                        className="grid grid-cols-2 gap-[9px]"
                        style={{
                            width: `${PHOTO_WIDTH * 2 + GAP_BETWEEN_PHOTOS}px`, //138*2 +9=285px
                            height: `${PHOTO_HEIGHT * 2 + GAP_BETWEEN_PHOTOS}px`, //209*2 +9=427px
                            marginLeft: `${LEFT_RIGHT_GAP}px`, //19px
                            marginRight: `${LEFT_RIGHT_GAP}px`, //19px
                        }}
                    >
                        {photos.map((photo, index) => (
                            <img
                                key={index}
                                src={photo}
                                alt={`Photo ${index + 1}`}
                                className="object-cover rounded-md"
                                style={{
                                    width: `${PHOTO_WIDTH}px`, //138px
                                    height: `${PHOTO_HEIGHT}px`, //209px
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

                {/* Custom Frame Overlay */}
                {selectedFrame?.type === "custom" && (
                    <img
                        src={selectedFrame.src}
                        alt={`Frame ${selectedFrame.name}`}
                        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                        style={{ zIndex: 2 }}
                    />
                )}
            </div>

            {/* Frame Options */}
            <div className="w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4">Choose a Frame</h2>
                
                {/* Color Frames */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Color Frames</h3>
                    <div className="flex flex-wrap gap-4">
                        {colorFrames.map((frame) => (
                            <div
                                key={frame.id}
                                className={`flex flex-col items-center cursor-pointer p-2 rounded-md border-2 ${
                                    selectedFrame?.id === frame.id ? "border-blue-500" : "border-transparent"
                                }`}
                                onClick={() => handleSelectFrame(frame)}
                            >
                                <div
                                    className="w-16 h-16 rounded-full mb-2"
                                    style={{ backgroundColor: frame.src }}
                                ></div>
                                <p className="text-center">{frame.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Frames */}
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Custom Frames</h3>
                    <div className="flex flex-wrap gap-4">
                        {customFrames.length > 0 ? (
                            customFrames.map((frame) => (
                                <div
                                    key={frame.id}
                                    className={`flex flex-col items-center cursor-pointer p-2 rounded-md border-2 ${
                                        selectedFrame?.id === frame.id ? "border-blue-500" : "border-transparent"
                                    }`}
                                    onClick={() => handleSelectFrame(frame)}
                                >
                                    <img
                                        src={frame.src}
                                        alt={frame.name}
                                        className="w-24 h-24 object-contain mb-2"
                                    />
                                    <p className="text-center">{frame.name}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No custom frames available.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Proceed Button */}
            <button
                onClick={handleProceed}
                className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition"
                disabled={!selectedFrame}
            >
                Proceed to Finalize
            </button>
        </div>
    );
}
