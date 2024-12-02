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
    const SCALE_FACTOR = 0.7; // 70% of original size

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
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)]">
            <h1 className="text-2xl font-bold mb-6">Select a Frame for Your Photos</h1>
            
            {/* Frame Canvas */}
            <div
                className="relative mb-8"
                style={{
                    width: `${ORIGINAL_WIDTH * SCALE_FACTOR}px`,
                    height: `${ORIGINAL_HEIGHT * SCALE_FACTOR}px`,
                    backgroundColor: selectedFrame?.type === "color" ? selectedFrame.src : "transparent",
                    position: "relative",
                }}
            >
                {/* Photo Grid */}
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 gap-7"
                    style={{
                        width: `${950 * SCALE_FACTOR}px`,
                        height: `${1424 * SCALE_FACTOR}px`,
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
                                width: `${461 * SCALE_FACTOR}px`,
                                height: `${698 * SCALE_FACTOR}px`,
                            }}
                        />
                    ))}
                </div>

                {/* Custom Frame Overlay */}
                {selectedFrame?.type === "custom" && (
                    <img
                        src={selectedFrame.src}
                        alt={`Frame ${selectedFrame.name}`}
                        className="absolute top-0 left-0 w-full h-full object-contain pointer-events-none"
                        style={{ zIndex: 2 }}
                    />
                )}

                {/* Top and Bottom Borders for Color Frames */}
                {selectedFrame?.type === "color" && (
                    <>
                        <div
                            className="absolute top-0 left-0 w-full"
                            style={{ height: `${28 * SCALE_FACTOR}px`, backgroundColor: selectedFrame.src }}
                        ></div>
                        <div
                            className="absolute bottom-0 left-0 w-full"
                            style={{ height: `${28 * SCALE_FACTOR}px`, backgroundColor: selectedFrame.src }}
                        ></div>
                        <div
                            className="absolute left-0 right-0"
                            style={{ 
                                top: `${28 * SCALE_FACTOR}px`,
                                bottom: `${28 * SCALE_FACTOR}px`,
                                backgroundColor: selectedFrame.src 
                            }}
                        ></div>
                    </>
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
