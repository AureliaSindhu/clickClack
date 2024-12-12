"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import "../style.css";
import Footer from "../../components/footer";

interface Frame {
    id: string;
    type: "color" | "custom";
    src: string; 
    thumbnailSrc: string;
    name: string;
}

export default function FramePage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
    const [isColorFrame, setIsColorFrame] = useState<boolean>(true);

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
    const GAP_BETWEEN_PHOTOS = Math.round(28 * SCALE_FACTOR); //9px
    const LEFT_RIGHT_GAP = Math.round(65 * SCALE_FACTOR); //19px

    // Predefined color frames (image-based frames with solid borders)
    const colorFrames = useMemo(() => [
        { id: "color1", type: "color" as "color", src: "/color-frames/frame1.png", thumbnailSrc: "/color-frames/frame1-thumb.png", name: "Charcoal" },
        { id: "color2", type: "color" as "color", src: "/color-frames/frame2.png", thumbnailSrc: "/color-frames/frame2-thumb.png", name: "Deep Purple" },
        { id: "color3", type: "color" as "color", src: "/color-frames/frame3.png", thumbnailSrc: "/color-frames/frame3-thumb.png", name: "Slate" },
        { id: "color4", type: "color" as "color", src: "/color-frames/frame4.png", thumbnailSrc: "/color-frames/frame4-thumb.png", name: "Purple Gray" },
        { id: "color5", type: "color" as "color", src: "/color-frames/frame5.png", thumbnailSrc: "/color-frames/frame5-thumb.png", name: "Mountain" },
        { id: "color6", type: "color" as "color", src: "/color-frames/frame6.png", thumbnailSrc: "/color-frames/frame6-thumb.png", name: "Beige" },
        { id: "color7", type: "color" as "color", src: "/color-frames/frame7.png", thumbnailSrc: "/color-frames/frame7-thumb.png", name: "Alabaster" },
        { id: "color8", type: "color" as "color", src: "/color-frames/frame8.png", thumbnailSrc: "/color-frames/frame8-thumb.png", name: "White" },
        // Add more color frames as needed
    ], []);
    
    // Predefined custom frames (images with transparent backgrounds)
    const customFrames = useMemo(() => [
        { id: "custom1", type: "custom" as "custom", src: "/custom-frames/cframe1.png", thumbnailSrc: "/custom-frames/cframe1-thumb.png", name: "Snow" },
        { id: "custom2", type: "custom" as "custom", src: "/custom-frames/cframe2.png", thumbnailSrc: "/custom-frames/cframe2-thumb.png", name: "Pattern" },
        { id: "custom3", type: "custom" as "custom", src: "/custom-frames/cframe3.png", thumbnailSrc: "/custom-frames/cframe3-thumb.png", name: "Ginger Man" },
        { id: "custom4", type: "custom" as "custom", src: "/custom-frames/cframe4.png", thumbnailSrc: "/custom-frames/cframe4-thumb.png", name: "Town" },
        { id: "custom5", type: "custom" as "custom", src: "/custom-frames/cframe5.png", thumbnailSrc: "/custom-frames/cframe5-thumb.png", name: "Table" },
        { id: "custom6", type: "custom" as "custom", src: "/custom-frames/cframe6.png", thumbnailSrc: "/custom-frames/cframe6-thumb.png", name: "Tree" },
        // Add more custom frames as needed
    ], []);

    useEffect(() => {
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        } else {
            router.push("/capture");
        }

        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        if (storedSelectedFrame) {
            setSelectedFrame(JSON.parse(storedSelectedFrame));
        } else {
            setSelectedFrame(colorFrames[0]);
        }

        const storedFrameType = sessionStorage.getItem("isColorFrame");
        if (storedFrameType !== null) {
            setIsColorFrame(storedFrameType === "true");
        }

    }, [colorFrames, customFrames, router]);

    // Handle frame selection
    const handleSelectFrame = (frame: Frame) => {
        setSelectedFrame(frame);
        sessionStorage.setItem("selectedFrame", JSON.stringify(frame));
    };

    // Handle frame type selection
    const handleToggle = (frameType: "color" | "custom") => {
        const isColor = frameType === "color";
        setIsColorFrame(isColor);
        sessionStorage.setItem("isColorFrame", isColor.toString());

        if (isColor) {
            // Switching to color frames
            const defaultColorFrame = colorFrames[0];
            setSelectedFrame(defaultColorFrame);
            sessionStorage.setItem("selectedFrame", JSON.stringify(defaultColorFrame));
        } else {
            // Switching to custom frames
            const defaultCustomFrame = customFrames[0];
            setSelectedFrame(defaultCustomFrame);
            sessionStorage.setItem("selectedFrame", JSON.stringify(defaultCustomFrame));
        }
    };

    const handleProceed = () => {
        // Proceed to the next step/page
        router.push("/finalize"); // Update the route as needed
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] p-10 text-black">
            <h1 className="text-2xl mb-6 font-chillax">Select a Frame for Your Photos</h1>

            {/* Frame Canvas */}
            <div
                className="flex flex-col relative mb-8"
                style={{
                    width: `${SCALED_FRAME_WIDTH}px`, //324px
                    height: `${SCALED_FRAME_HEIGHT}px`, //576px
                    backgroundColor: selectedFrame?.type === "color" ? "transparent" : "transparent", // Always transparent
                    position: "relative",
                }}
            >
                {/* Top Border */}
                <div
                    className="w-full"
                    style={{
                        height: `${SCALED_TOP_HEIGHT}px`, //22px
                        backgroundColor: selectedFrame?.type === "color" ? "transparent" : "transparent",
                    }}
                ></div>

                {/* Photo Grid */}
                <div className="flex-grow flex justify-center items-center">
                    <div
                        // className="grid grid-cols-2 gap-[9px]"
                        // style={{
                        //     width: `${PHOTO_WIDTH * 2 + GAP_BETWEEN_PHOTOS}px`, //138*2 +9=285px
                        //     height: `${PHOTO_HEIGHT * 2 + GAP_BETWEEN_PHOTOS}px`, //209*2 +9=427px
                        //     marginLeft: `${LEFT_RIGHT_GAP}px`, //19px
                        //     marginRight: `${LEFT_RIGHT_GAP}px`, //19px
                        // }}
                        className="grid"
                        style={{
                            width: `${PHOTO_WIDTH * 2 + GAP_BETWEEN_PHOTOS}px`, //138*2 + 9 = 285px
                            height: `${PHOTO_HEIGHT * 2 + GAP_BETWEEN_PHOTOS}px`, //209*2 + 9 = 427px
                            marginLeft: `${LEFT_RIGHT_GAP}px`, // 19px
                            marginRight: `${LEFT_RIGHT_GAP}px`, // 19px
                            gridTemplateColumns: 'repeat(2, 1fr)', // 2 columns
                            gridTemplateRows: 'repeat(2, 1fr)', // 2 rows
                            gap: `${GAP_BETWEEN_PHOTOS}px` // 9px between items
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
                         // backgroundColor: selectedFrame?.type === "color" ? "transparent" : "transparent", // Always transparent
                    }}
                ></div>

                {/* Frame Overlay */}
                {selectedFrame && (
                    <img
                        src={selectedFrame.src}
                        alt={`Frame ${selectedFrame.name}`}
                        className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                        style={{ zIndex: 2 }}
                        // onError={(e) => {
                        //     (e.target as HTMLImageElement).src = "/fallback-frame.png"; // Provide a fallback image
                        // }}
                    />
                )}
            </div>

            {/* Frame Options */}
            <div className="w-full max-w-4xl">
                <h2 className="text-xl font-semibold font-chillax mb-4">Choose a Frame</h2>

                {/* Frame Type Selection List */}
                <div className="flex space-x-8 mb-6 border-b-2 border-gray-200">
                    <button
                        onClick={() => handleToggle("color")}
                        className={`text-lg font-medium pb-2 ${
                            isColorFrame
                                ? "border-b-2 border-[var(--canvas-darker)] text-[var(--canvas-darker)]"
                                : "text-gray-700 hover:text-[var(--canvas-darker)]"
                        } focus:outline-none`}
                        aria-pressed={isColorFrame}
                    >
                        Color Frames
                    </button>
                    <button
                        onClick={() => handleToggle("custom")}
                        className={`text-lg font-medium pb-2 ${
                            !isColorFrame
                                ? "border-b-2 border-[var(--canvas-darker)] text-[var(--canvas-darker)]"
                                : "text-gray-700 hover:text-[var(--canvas-darker)]"
                        } focus:outline-none`}
                        aria-pressed={!isColorFrame}
                    >
                        Custom Frames
                    </button>
                </div>

                {/* Frame Selection Based on Toggle */}
                <div className="mb-6">
                    {isColorFrame ? (
                        <div className="flex gap-4 overflow-x-auto flex-nowrap custom-scrollbar">
                        {colorFrames.map((frame) => (
                                <div
                                    key={frame.id}
                                    className={`flex flex-col items-center cursor-pointer p-2 rounded-md border-2 ${
                                        selectedFrame?.id === frame.id ? "border-[var(--canvas-darker)]" : "border-transparent"
                                    }`}
                                    onClick={() => handleSelectFrame(frame)}
                                    role="button"
                                    aria-pressed={selectedFrame?.id === frame.id}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            handleSelectFrame(frame);
                                        }
                                    }}
                                >
                                    {/* Frame Thumbnail */}
                                    <div className="w-14 h-14 rounded-full overflow-hidden mb-2">
                                        <img
                                        src={frame.thumbnailSrc}
                                        alt={frame.name}
                                        className="w-full h-full object-cover"
                                        // onError={(e) => {
                                        //     // (e.target as HTMLImageElement).src = "/fallback-frame.png"; 
                                        // }}
                                        />
                                    </div>
                                    <p className={`text-center font-medium ${selectedFrame?.id === frame.id ? "text-[var(--canvas-darker)]" : "text-gray-700"}`}>{frame.name}</p>
                                    </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto flex-nowrap custom-scrollbar">
                            {customFrames.length > 0 ? (
                                customFrames.map((frame) => (
                                    <div
                                        key={frame.id}
                                        className={`flex flex-col items-center cursor-pointer p-2 rounded-md border-2 ${
                                        selectedFrame?.id === frame.id ? "border-[var(--canvas-darker)]" : "border-transparent"
                                        }`}                                        
                                        onClick={() => handleSelectFrame(frame)}
                                        role="button"
                                        aria-pressed={selectedFrame?.id === frame.id}
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                handleSelectFrame(frame);
                                            }
                                        }}
                                    >
                                        {/* Frame Thumbnail */}
                                        <div className="w-14 h-14 rounded-full overflow-hidden mb-2">
                                        <img
                                                src={frame.thumbnailSrc}
                                                alt={frame.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "/fallback-frame.png"; // Provide a fallback image
                                                }}
                                            />
                                        </div>
                                        <p className={`text-center font-medium ${selectedFrame?.id === frame.id ? "text-[var(--canvas-darker)]" : "text-gray-700"}`}>{frame.name}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No custom frames available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Proceed Button */}
            <button
                onClick={handleProceed}
                className="mt-4 px-6 py-3 bg-[#536659] text-white rounded-lg shadow-lg hover:bg-[#356c47] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!selectedFrame}
            >
                Proceed to Finalize
            </button>

            <Footer/>
        </div>
    );
}
