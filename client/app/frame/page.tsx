"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhotoThumbnail from "../../components/PhotoThumbnail"; 
import { Footer } from "../../components/footer";
import "../style.css";
import { colorFrames, customFrames, Frame } from "./data/framesData";

export default function FramePage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
    const [isColorFrame, setIsColorFrame] = useState<boolean>(true);

    // Original dimensions
    const ORIGINAL_WIDTH = 1080;
    const ORIGINAL_HEIGHT = 1920;

    // Preview scaling factor
    const SCALE_FACTOR = 0.3;
    const SCALED_FRAME_WIDTH = Math.round(ORIGINAL_WIDTH * SCALE_FACTOR);
    const SCALED_FRAME_HEIGHT = Math.round(ORIGINAL_HEIGHT * SCALE_FACTOR);

    // Positioning for photo grid
    const SCALED_TOP_OFFSET = Math.round(75 * SCALE_FACTOR);
    const SCALED_LEFT_OFFSET = Math.round(65 * SCALE_FACTOR);
    const SCALED_PHOTO_WIDTH = Math.round(461 * SCALE_FACTOR);
    const SCALED_PHOTO_HEIGHT = Math.round(698 * SCALE_FACTOR);
    const SCALED_GAP = Math.round(28 * SCALE_FACTOR);

    useEffect(() => {
        // Load photos from sessionStorage; if not found, redirect to capture page.
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
            setPhotos(JSON.parse(storedPhotos));
        } else {
            router.push("/capture");
        }

        // Load selected frame from sessionStorage; if not found, default to the first color frame.
        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        if (storedSelectedFrame) {
            setSelectedFrame(JSON.parse(storedSelectedFrame));
        } else {
            setSelectedFrame(colorFrames[0]);
            sessionStorage.setItem("selectedFrame", JSON.stringify(colorFrames[0]));
        }

        // Load frame type from sessionStorage; if not found, default to color frames.
        const storedFrameType = sessionStorage.getItem("isColorFrame");
        if (storedFrameType !== null) {
            setIsColorFrame(storedFrameType === "true");
        } else {
            setIsColorFrame(true);
            sessionStorage.setItem("isColorFrame", "true");
        }
    }, [colorFrames, router]);

    const handleSelectFrame = (frame: Frame) => {
        setSelectedFrame(frame);
        sessionStorage.setItem("selectedFrame", JSON.stringify(frame));
    };

    const handleToggle = (frameType: "color" | "custom") => {
        const isColor = frameType === "color";
        setIsColorFrame(isColor);
        sessionStorage.setItem("isColorFrame", isColor.toString());

        if (isColor) {
        setSelectedFrame(colorFrames[0]);
        sessionStorage.setItem("selectedFrame", JSON.stringify(colorFrames[0]));
        } else {
        setSelectedFrame(customFrames[0]);
        sessionStorage.setItem("selectedFrame", JSON.stringify(customFrames[0]));
        }
    };

    const handleProceed = () => {
        router.push("/finalize");
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] p-10 text-black">
        <h1 className="text-2xl mb-6 font-chillax">Select a Frame for Your Photos</h1>

        {/* Frame Preview Container */}
        <div
            className="relative mb-8"
            style={{
            width: `${SCALED_FRAME_WIDTH}px`,
            height: `${SCALED_FRAME_HEIGHT}px`,
            }}
        >
            {/* Photo Grid */}
            <div
            style={{
                position: "absolute",
                top: `${SCALED_TOP_OFFSET}px`,
                left: `${SCALED_LEFT_OFFSET}px`,
                width: `${SCALED_PHOTO_WIDTH * 2 + SCALED_GAP}px`,
                height: `${SCALED_PHOTO_HEIGHT * 2 + SCALED_GAP}px`,
            }}
            >
            {[0, 1, 2, 3].map((index) => {
                const photo = photos[index];
                const row = Math.floor(index / 2);
                const col = index % 2;
                return (
                <div
                    key={index}
                    style={{
                    position: "absolute",
                    top: row * (SCALED_PHOTO_HEIGHT + SCALED_GAP),
                    left: col * (SCALED_PHOTO_WIDTH + SCALED_GAP),
                    }}
                >
                    {photo ? (
                    <PhotoThumbnail
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        width={SCALED_PHOTO_WIDTH}
                        height={SCALED_PHOTO_HEIGHT}
                        className="object-cover"
                    />
                    ) : (
                    <div
                        className="flex items-center justify-center bg-gray-200 text-gray-500 rounded"
                        style={{
                        width: SCALED_PHOTO_WIDTH,
                        height: SCALED_PHOTO_HEIGHT,
                        }}
                    >
                        No Photo
                    </div>
                    )}
                </div>
                );
            })}
            </div>

            {/* Frame Overlay */}
            {selectedFrame && (
            <img
                src={selectedFrame.src}
                alt={`Frame ${selectedFrame.name}`}
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                style={{ zIndex: 2 }}
            />
            )}
        </div>

        {/* Frame Type Selection */}
        <div className="w-full max-w-4xl">
            <h2 className="text-xl font-semibold font-chillax mb-4">Choose a Frame</h2>
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

            {/* Frame Selection Thumbnails */}
            <div className="mb-6">
            {isColorFrame ? (
                <div className="flex gap-4 overflow-x-auto flex-nowrap custom-scrollbar">
                {colorFrames.map((frame) => (
                    <div
                    key={frame.id}
                    className={`flex flex-col items-center cursor-pointer p-2 rounded-md border-2 ${
                        selectedFrame?.id === frame.id
                        ? "border-[var(--canvas-darker)]"
                        : "border-transparent"
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
                    <div className="w-14 h-14 rounded-full overflow-hidden mb-2">
                        <PhotoThumbnail
                        src={frame.thumbnailSrc}
                        alt={frame.name}
                        width="100%"
                        height="100%"
                        className="object-cover"
                        fallbackSrc="/fallback-frame.png"
                        />
                    </div>
                    <p
                        className={`text-center font-medium ${
                        selectedFrame?.id === frame.id
                            ? "text-[var(--canvas-darker)]"
                            : "text-gray-700"
                        }`}
                    >
                        {frame.name}
                    </p>
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
                        selectedFrame?.id === frame.id
                            ? "border-[var(--canvas-darker)]"
                            : "border-transparent"
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
                        <div className="w-14 h-14 rounded-full overflow-hidden mb-2">
                        <PhotoThumbnail
                            src={frame.thumbnailSrc}
                            alt={frame.name}
                            width="100%"
                            height="100%"
                            className="object-cover"
                            fallbackSrc="/fallback-frame.png"
                        />
                        </div>
                        <p
                        className={`text-center font-medium ${
                            selectedFrame?.id === frame.id
                            ? "text-[var(--canvas-darker)]"
                            : "text-gray-700"
                        }`}
                        >
                        {frame.name}
                        </p>
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500">No custom frames available.</p>
                )}
                </div>
            )}
            </div>
        </div>

        <button
            onClick={handleProceed}
            className="mt-4 px-6 py-3 bg-[#536659] text-white rounded-lg shadow-lg hover:bg-[#356c47] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!selectedFrame}
        >
            Proceed to Finalize
        </button>

        <Footer />
        </div>
    );
}
