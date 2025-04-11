"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhotoThumbnail from "../../components/PhotoThumbnail";
import { Footer } from "../../components/footer";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import "../style.css";
import { colorFrames, customFrames, Frame } from "./data/framesData";

export default function FramePage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
    // Used only for layouts where both frame types are allowed.
    const [isColorFrame, setIsColorFrame] = useState<boolean>(true);
    // Layout option comes from the option page and can be "2x2", "1x4", or "specialEd"
    const [layoutOption, setLayoutOption] = useState<"2x2" | "1x4" | "specialEd">("2x2");

    // Original dimensions and scaling factor
    const ORIGINAL_WIDTH = 1080;
    const ORIGINAL_HEIGHT = 1920;
    const SCALE_FACTOR = 0.3;

    // Mapping layout options to grid & preview settings.
    const layoutSettings: Record<
        "2x2" | "1x4" | "specialEd",
        {
        rows: number;
        columns: number;
        topOffset: number;
        leftOffset: number;
        photoWidth: number;
        photoHeight: number;
        gap: number;
        frameWidth: number;
        frameHeight: number;
        }
    > = {
        "2x2": {
        rows: 2,
        columns: 2,
        topOffset: Math.round(75 * SCALE_FACTOR),
        leftOffset: Math.round(65 * SCALE_FACTOR),
        photoWidth: Math.round(461 * SCALE_FACTOR),
        photoHeight: Math.round(698 * SCALE_FACTOR),
        gap: Math.round(28 * SCALE_FACTOR),
        frameWidth: Math.round(ORIGINAL_WIDTH * SCALE_FACTOR),
        frameHeight: Math.round(ORIGINAL_HEIGHT * SCALE_FACTOR),
        },
        "1x4": {
        rows: 1,
        columns: 4,
        topOffset: Math.round(50 * SCALE_FACTOR),
        leftOffset: Math.round(20 * SCALE_FACTOR),
        photoWidth: Math.round(250 * SCALE_FACTOR),
        photoHeight: Math.round(350 * SCALE_FACTOR),
        gap: Math.round(15 * SCALE_FACTOR),
        frameWidth: Math.round(ORIGINAL_WIDTH * SCALE_FACTOR),
        frameHeight: Math.round(ORIGINAL_HEIGHT * SCALE_FACTOR),
        },
        "specialEd": {
        // Adjust these values to match your specialEd design spacing.
        rows: 2,
        columns: 2,
        topOffset: Math.round(80 * SCALE_FACTOR),
        leftOffset: Math.round(60 * SCALE_FACTOR),
        photoWidth: Math.round(480 * SCALE_FACTOR),
        photoHeight: Math.round(680 * SCALE_FACTOR),
        gap: Math.round(30 * SCALE_FACTOR),
        frameWidth: Math.round(ORIGINAL_WIDTH * SCALE_FACTOR),
        frameHeight: Math.round(ORIGINAL_HEIGHT * SCALE_FACTOR),
        },
    };

    // Pick the settings for the current layout option.
    const currentLayout = layoutSettings[layoutOption];

    useEffect(() => {
        // Retrieve stored photos; if not, redirect to the capture page.
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
        } else {
        router.push("/capture");
        }

        // Retrieve the selected frame from sessionStorage or set a default.
        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        if (storedSelectedFrame) {
        setSelectedFrame(JSON.parse(storedSelectedFrame));
        } else {
        setSelectedFrame(colorFrames[0]);
        sessionStorage.setItem("selectedFrame", JSON.stringify(colorFrames[0]));
        }

        // Retrieve layout option from sessionStorage (set on the option page).
        const storedLayout = sessionStorage.getItem("layoutOption");
        if (
        storedLayout &&
        (storedLayout === "2x2" || storedLayout === "1x4" || storedLayout === "specialEd")
        ) {
        setLayoutOption(storedLayout as "2x2" | "1x4" | "specialEd");
        }

        // For "specialEd", force the frame type to color.
        if (storedLayout === "specialEd") {
        setIsColorFrame(true);
        } else {
        // For other layouts, load frame type if stored, otherwise default to color frames.
        const storedFrameType = sessionStorage.getItem("isColorFrame");
        if (storedFrameType !== null) {
            setIsColorFrame(storedFrameType === "true");
        } else {
            setIsColorFrame(true);
            sessionStorage.setItem("isColorFrame", "true");
        }
        }
    }, [router]);

    const handleSelectFrame = (frame: Frame) => {
        setSelectedFrame(frame);
        sessionStorage.setItem("selectedFrame", JSON.stringify(frame));
    };

    const handleToggle = (frameType: "color" | "custom") => {
        if (layoutOption === "specialEd") return; // Prevent toggling in specialEd mode.
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

    // Total photos based on grid structure.
    const totalPhotos = currentLayout.rows * currentLayout.columns;

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] p-6">
        <Card className="w-full max-w-xl shadow-none bg-[var(--canvas)] mb-6 p-6">
            <h1 className="text-2xl font-chillax text-center mb-4">Select a Frame for Your Photos</h1>
            {/* Frame Preview Container */}
            <div
            className="relative mb-6"
            style={{
                width: `${currentLayout.frameWidth}px`,
                height: `${currentLayout.frameHeight}px`,
            }}
            >
            {/* Photo Grid */}
            <div
                style={{
                position: "absolute",
                top: `${currentLayout.topOffset}px`,
                left: `${currentLayout.leftOffset}px`,
                width: `${
                    currentLayout.columns * currentLayout.photoWidth +
                    (currentLayout.columns - 1) * currentLayout.gap
                }px`,
                height: `${
                    currentLayout.rows * currentLayout.photoHeight +
                    (currentLayout.rows - 1) * currentLayout.gap
                }px`,
                }}
            >
                {Array.from({ length: totalPhotos }).map((_, index) => {
                const row = Math.floor(index / currentLayout.columns);
                const col = index % currentLayout.columns;
                const photo = photos[index];
                return (
                    <div
                    key={index}
                    style={{
                        position: "absolute",
                        top: row * (currentLayout.photoHeight + currentLayout.gap),
                        left: col * (currentLayout.photoWidth + currentLayout.gap),
                    }}
                    >
                    {photo ? (
                        <PhotoThumbnail
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        width={currentLayout.photoWidth}
                        height={currentLayout.photoHeight}
                        className="object-cover"
                        />
                    ) : (
                        <div
                        className="flex items-center justify-center bg-gray-200 text-gray-500 rounded"
                        style={{
                            width: currentLayout.photoWidth,
                            height: currentLayout.photoHeight,
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
            {layoutOption !== "specialEd" ? (
            <>
                <h2 className="text-xl font-semibold font-chillax mb-4">Choose a Frame Type</h2>
                <div className="flex justify-center space-x-6 mb-4">
                <Button
                    onClick={() => handleToggle("color")}
                    className={`px-4 py-2 ${
                    isColorFrame
                        ? "border-b-2 border-[var(--canvas-darker)] text-[var(--canvas-darker)]"
                        : "text-gray-700 hover:text-[var(--canvas-darker)]"
                    }`}
                    aria-pressed={isColorFrame}
                >
                    Color Frames
                </Button>
                <Button
                    onClick={() => handleToggle("custom")}
                    className={`px-4 py-2 ${
                    !isColorFrame
                        ? "border-b-2 border-[var(--canvas-darker)] text-[var(--canvas-darker)]"
                        : "text-gray-700 hover:text-[var(--canvas-darker)]"
                    }`}
                    aria-pressed={!isColorFrame}
                >
                    Custom Frames
                </Button>
                </div>

                <div className="flex gap-4 overflow-x-auto flex-nowrap custom-scrollbar">
                {(isColorFrame ? colorFrames : customFrames).map((frame) => (
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
                        selectedFrame?.id === frame.id ? "text-[var(--canvas-darker)]" : "text-gray-700"
                        }`}
                    >
                        {frame.name}
                    </p>
                    </div>
                ))}
                </div>
            </>
            ) : (
            // For specialEd layout, show only one frame type.
            <>
                <h2 className="text-xl font-semibold font-chillax mb-4">Choose a Frame</h2>
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
                        selectedFrame?.id === frame.id ? "text-[var(--canvas-darker)]" : "text-gray-700"
                        }`}
                    >
                        {frame.name}
                    </p>
                    </div>
                ))}
                </div>
            </>
            )}

            <div className="mt-6 flex justify-center">
            <Button
                onClick={handleProceed}
                disabled={!selectedFrame}
                className="px-6 py-3 bg-[#536659] text-white rounded-lg shadow-lg hover:bg-[#356c47] transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                Proceed to Finalize
            </Button>
            </div>
        </Card>
        <Footer />
        </div>
    );
}
