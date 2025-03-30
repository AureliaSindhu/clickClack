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

    // ori
    const ORIGINAL_WIDTH = 1080;
    const ORIGINAL_HEIGHT = 1920;

    //preview
    const SCALE_FACTOR = 0.3;
    const SCALED_FRAME_WIDTH = Math.round(ORIGINAL_WIDTH * SCALE_FACTOR);  // 324
    const SCALED_FRAME_HEIGHT = Math.round(ORIGINAL_HEIGHT * SCALE_FACTOR); // 576

    // positioning
    const SCALED_TOP_OFFSET = Math.round(75 * SCALE_FACTOR);    // ~22
    const SCALED_LEFT_OFFSET = Math.round(65 * SCALE_FACTOR);   // ~19
    const SCALED_PHOTO_WIDTH = Math.round(461 * SCALE_FACTOR);  // ~138
    const SCALED_PHOTO_HEIGHT = Math.round(698 * SCALE_FACTOR); // ~209
    const SCALED_GAP = Math.round(28 * SCALE_FACTOR);           // ~9

    const colorFrames: readonly Frame[] = useMemo(
        () => [
        {
            id: "color1",
            type: "color",
            src: "/color-frames/frame1-thumb.png",
            thumbnailSrc: "/color-frames/frame1-thumb.png",
            name: "Charcoal",
        },
        {
            id: "color2",
            type: "color",
            src: "/color-frames/frame2.png",
            thumbnailSrc: "/color-frames/frame2-thumb.png",
            name: "Deep Purple",
        },
        {
            id: "color3",
            type: "color",
            src: "/color-frames/frame3.png",
            thumbnailSrc: "/color-frames/frame3-thumb.png",
            name: "Slate",
        },
        {
            id: "color4",
            type: "color",
            src: "/color-frames/frame4.png",
            thumbnailSrc: "/color-frames/frame4-thumb.png",
            name: "Purple Gray",
        },
        {
            id: "color5",
            type: "color",
            src: "/color-frames/frame5.png",
            thumbnailSrc: "/color-frames/frame5-thumb.png",
            name: "Mountain",
        },
        {
            id: "color6",
            type: "color",
            src: "/color-frames/frame6.png",
            thumbnailSrc: "/color-frames/frame6-thumb.png",
            name: "Beige",
        },
        {
            id: "color7",
            type: "color",
            src: "/color-frames/frame7.png",
            thumbnailSrc: "/color-frames/frame7-thumb.png",
            name: "Alabaster",
        },
        {
            id: "color8",
            type: "color",
            src: "/color-frames/frame8.png",
            thumbnailSrc: "/color-frames/frame8-thumb.png",
            name: "White",
        },
        ],
        []
    );

    const customFrames: readonly Frame[] = useMemo(
        () => [
        {
            id: "custom1",
            type: "custom",
            src: "/custom-frames/cframe1.png",
            thumbnailSrc: "/custom-frames/cframe1-thumb.png",
            name: "Snow",
        },
        {
            id: "custom2",
            type: "custom",
            src: "/custom-frames/cframe2.png",
            thumbnailSrc: "/custom-frames/cframe2-thumb.png",
            name: "Pattern",
        },
        {
            id: "custom3",
            type: "custom",
            src: "/custom-frames/cframe3.png",
            thumbnailSrc: "/custom-frames/cframe3-thumb.png",
            name: "Cookies",
        },
        {
            id: "custom4",
            type: "custom",
            src: "/custom-frames/cframe4.png",
            thumbnailSrc: "/custom-frames/cframe4-thumb.png",
            name: "Town",
        },
        {
            id: "custom5",
            type: "custom",
            src: "/custom-frames/cframe5.png",
            thumbnailSrc: "/custom-frames/cframe5-thumb.png",
            name: "Table",
        },
        {
            id: "custom6",
            type: "custom",
            src: "/custom-frames/cframe6.png",
            thumbnailSrc: "/custom-frames/cframe6-thumb.png",
            name: "Tree",
        },
        ],
        []
    );

    useEffect(() => {
        // Load photos from sessionStorage
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
        } else {
        router.push("/capture");
        }

        // load
        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        if (storedSelectedFrame) {
        setSelectedFrame(JSON.parse(storedSelectedFrame));
        } else {
        // def first color frame
        setSelectedFrame(colorFrames[0]);
        sessionStorage.setItem("selectedFrame", JSON.stringify(colorFrames[0]));
        }

        const storedFrameType = sessionStorage.getItem("isColorFrame");
        if (storedFrameType !== null) {
        setIsColorFrame(storedFrameType === "true");
        } else {
        setIsColorFrame(true);
        sessionStorage.setItem("isColorFrame", "true");
        }
    }, [colorFrames, customFrames, router]);

    const handleSelectFrame = (frame: Frame) => {
        setSelectedFrame(frame);
        sessionStorage.setItem("selectedFrame", JSON.stringify(frame));
    };

    const handleToggle = (frameType: "color" | "custom") => {
        const isColor = frameType === "color";
        setIsColorFrame(isColor);
        sessionStorage.setItem("isColorFrame", isColor.toString());

        if (isColor) {
        const defaultColorFrame = colorFrames[0];
        setSelectedFrame(defaultColorFrame);
        sessionStorage.setItem("selectedFrame", JSON.stringify(defaultColorFrame));
        } else {
        const defaultCustomFrame = customFrames[0];
        setSelectedFrame(defaultCustomFrame);
        sessionStorage.setItem("selectedFrame", JSON.stringify(defaultCustomFrame));
        }
    };

    const handleProceed = () => {
        router.push("/finalize");
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] p-10 text-black">
        <h1 className="text-2xl mb-6 font-chillax">Select a Frame for Your Photos</h1>

        {/* Frame Preview Container (scaled down) */}
        <div
            className="relative mb-8"
            style={{
            width: `${SCALED_FRAME_WIDTH}px`,   // e.g. 324
            height: `${SCALED_FRAME_HEIGHT}px`, // e.g. 576
            }}
        >
            {/* Photo Grid: 4 photos absolutely positioned */}
            <div
            style={{
                position: "absolute",
                top: `${SCALED_TOP_OFFSET}px`,   // e.g. 22
                left: `${SCALED_LEFT_OFFSET}px`, // e.g. 19
                width: `${SCALED_PHOTO_WIDTH * 2 + SCALED_GAP}px`,   // ~285
                height: `${SCALED_PHOTO_HEIGHT * 2 + SCALED_GAP}px`, // ~427
            }}
            >
            {photos.slice(0, 4).map((photo, index) => {
                const row = Math.floor(index / 2);
                const col = index % 2;
                return (
                <img
                    key={index}
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="absolute object-cover"
                    style={{
                    top: row * (SCALED_PHOTO_HEIGHT + SCALED_GAP),
                    left: col * (SCALED_PHOTO_WIDTH + SCALED_GAP),
                    width: SCALED_PHOTO_WIDTH,
                    height: SCALED_PHOTO_HEIGHT,
                    }}
                />
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
                        <img
                        src={frame.thumbnailSrc}
                        alt={frame.name}
                        className="w-full h-full object-cover"
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
                        <img
                            src={frame.thumbnailSrc}
                            alt={frame.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                            (e.target as HTMLImageElement).src = "/fallback-frame.png";
                            }}
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
