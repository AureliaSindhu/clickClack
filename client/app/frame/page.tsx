"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import PhotoThumbnail from "../../components/PhotoThumbnail";
import { Footer } from "../../components/footer";
import "../style.css";
import {
    colorFrames as twoByTwoColorFrames,
    customFrames as twoByTwoCustomFrames,
    oneByFourColorFrames,
    oneByFourCustomFrames,
    specialEdColorFrames,
    Frame,
} from "./data/framesData";

export default function FramePage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
    const [isColorFrame, setIsColorFrame] = useState<boolean>(true);
    const [collageType, setCollageType] = useState<"2by2" | "oneByFour" | "specialEd">("2by2");

    // 1. Load collageType from sessionStorage, defaulting to "2by2" if none
    useEffect(() => {
        const storedCollageType = sessionStorage.getItem("collageType");
        if (
        storedCollageType === "2by2" ||
        storedCollageType === "oneByFour" ||
        storedCollageType === "specialEd"
        ) {
        setCollageType(storedCollageType);
        }
    }, []);

    // scale factor for specialEd to improve picture quality
    const effectiveScaleFactor = useMemo(
        () => (collageType === "specialEd" ? 0.4 : 0.2),
        [collageType]
    );

    // 2. Basic frame dimensions and scale factor
    const ORIGINAL_FRAME_WIDTH = 1080;
    const ORIGINAL_FRAME_HEIGHT = 1920;

    const SCALED_FRAME_WIDTH = Math.round(ORIGINAL_FRAME_WIDTH * effectiveScaleFactor);
    const SCALED_FRAME_HEIGHT = Math.round(ORIGINAL_FRAME_HEIGHT * effectiveScaleFactor);

    // 3. Layout config 
    const PREVIEW_CONFIG = {
        "2by2": {
            photoWidth: Math.round(461 * effectiveScaleFactor),
            photoHeight: Math.round(698 * effectiveScaleFactor),
            gap: Math.round(28 * effectiveScaleFactor),
            topOffset: Math.round(75 * effectiveScaleFactor),
            leftOffset: Math.round(65 * effectiveScaleFactor),
            layout: "2by2",
        },
        oneByFour: {
            photoWidth: Math.round(576 * effectiveScaleFactor),
            photoHeight: Math.round(390 * effectiveScaleFactor),
            gap: Math.round(20 * effectiveScaleFactor),
            topOffset: Math.round(27 * effectiveScaleFactor),
            leftOffset: Math.round(27 * effectiveScaleFactor),
            layout: "oneByFour",
        },
        specialEd: {
            photoWidth: Math.round(860 * effectiveScaleFactor),
            photoHeight: Math.round(530 * effectiveScaleFactor),
            gap: Math.round(0 * effectiveScaleFactor),
            topOffset: Math.round(572 * effectiveScaleFactor),
            leftOffset: Math.round(130 * effectiveScaleFactor),
            layout: "single",
        },
    } as const;

    const currentConfig = PREVIEW_CONFIG[collageType] || PREVIEW_CONFIG["2by2"];

    // 4. Frames array for the current collage type
    const frames = useMemo(() => {
        switch (collageType) {
        case "oneByFour":
            return {
            color: oneByFourColorFrames,
            custom: oneByFourCustomFrames,
            };
        case "specialEd":
            return {
            color: specialEdColorFrames, // only color frames
            custom: [],
            };
        case "2by2":
        default:
            return {
            color: twoByTwoColorFrames,
            custom: twoByTwoCustomFrames,
            };
        }
    }, [collageType]);

    // 5. Load photos from session storage. 
    useEffect(() => {
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
        } else {
        // redirect with collage type
        router.push(`/capture/${collageType}`);
        }
    }, [router, collageType]);

    // 6. Load whether we’re using color or custom frames
    useEffect(() => {
        const storedFrameType = sessionStorage.getItem("isColorFrame");
        if (storedFrameType !== null) {
        setIsColorFrame(storedFrameType === "true");
        } else {
        setIsColorFrame(true);
        sessionStorage.setItem("isColorFrame", "true");
        }
    }, []);

    // 7. Load or pick a default selected frame
    //    – If stored frame is invalid, missing, or from a different collageType, pick the first in the current array
    useEffect(() => {
        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        const storedFrameCollageType = sessionStorage.getItem("selectedFrameCollageType");
        let loadedFrame: Frame | null = null;
        if (storedSelectedFrame && storedFrameCollageType === collageType) {
        try {
            loadedFrame = JSON.parse(storedSelectedFrame);
        } catch {
            // ignore error and continue
        }
        }

        const validFrames = isColorFrame ? frames.color : frames.custom;
        const isValid = loadedFrame
        ? validFrames.some((f) => f.id === loadedFrame!.id)
        : false;

        if (isValid && loadedFrame) {
        setSelectedFrame(loadedFrame);
        } else {
        if (validFrames.length > 0) {
            setSelectedFrame(validFrames[0]);
            sessionStorage.setItem("selectedFrame", JSON.stringify(validFrames[0]));
            sessionStorage.setItem("selectedFrameCollageType", collageType);
        } else {
            setSelectedFrame(null);
            sessionStorage.removeItem("selectedFrame");
            sessionStorage.removeItem("selectedFrameCollageType");
        }
        }
    }, [frames, isColorFrame, collageType]);

    // 8. Handle toggling between color and custom frames
    const handleToggle = (frameType: "color" | "custom") => {
        const colorChosen = frameType === "color";
        setIsColorFrame(colorChosen);
        sessionStorage.setItem("isColorFrame", colorChosen.toString());

        const newFrames = colorChosen ? frames.color : frames.custom;
        if (newFrames.length > 0) {
        setSelectedFrame(newFrames[0]);
        sessionStorage.setItem("selectedFrame", JSON.stringify(newFrames[0]));
        sessionStorage.setItem("selectedFrameCollageType", collageType);
        } else {
        setSelectedFrame(null);
        sessionStorage.removeItem("selectedFrame");
        sessionStorage.removeItem("selectedFrameCollageType");
        }
    };

    // 9. Select a frame from the UI
    const handleSelectFrame = (frame: Frame) => {
        setSelectedFrame(frame);
        sessionStorage.setItem("selectedFrame", JSON.stringify(frame));
        sessionStorage.setItem("selectedFrameCollageType", collageType);
    };

    const handleProceed = () => {
        router.push("/finalize");
    };

    //container size for the photo grid
    const containerWidth = useMemo(() => {
        switch (currentConfig.layout) {
        case "single":
            return currentConfig.photoWidth;
        case "oneByFour":
            return currentConfig.photoWidth;
        case "2by2":
        default:
            return currentConfig.photoWidth * 2 + currentConfig.gap;
        }
    }, [currentConfig]);

    const containerHeight = useMemo(() => {
        switch (currentConfig.layout) {
        case "single":
            return currentConfig.photoHeight;
        case "oneByFour":
            return currentConfig.photoHeight * 4 + currentConfig.gap * 3;
        case "2by2":
        default:
            return currentConfig.photoHeight * 2 + currentConfig.gap;
        }
    }, [currentConfig]);

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] p-10 text-black">
        <h1 className="text-lg sm:text-xl mb-6 font-chillax">
            Select a Frame for Your Photos
        </h1>

        {/* Frame Preview Container */}
        <div
            className="relative mb-8"
            style={{
            width: `${SCALED_FRAME_WIDTH}px`,
            height: `${SCALED_FRAME_HEIGHT}px`,
            }}
        >
            {/* Photo Grid Container */}
            <div
            style={{
                position: "absolute",
                top: `${currentConfig.topOffset}px`,
                left:
                currentConfig.layout === "oneByFour"
                    ? `${(SCALED_FRAME_WIDTH - containerWidth) / 2}px`
                    : `${currentConfig.leftOffset}px`,
                width: `${containerWidth}px`,
                height: `${containerHeight}px`,
            }}
            >
            {/* Single-photo layout (specialEd) */}
            {currentConfig.layout === "single" && (
                <div style={{ position: "absolute", top: 0, left: 0 }}>
                {photos[0] ? (
                    <PhotoThumbnail
                    src={photos[0]}
                    alt="Special Ed Photo"
                    width={currentConfig.photoWidth}
                    height={currentConfig.photoHeight}
                    className="object-cover"
                    style={{ imageRendering: "auto" }}
                    />
                ) : (
                    <div
                    className="flex items-center justify-center bg-gray-200 text-gray-500 rounded"
                    style={{
                        width: currentConfig.photoWidth,
                        height: currentConfig.photoHeight,
                    }}
                    >
                    No Photo
                    </div>
                )}
                </div>
            )}

            {/* 2by2 layout */}
            {currentConfig.layout === "2by2" &&
                [0, 1, 2, 3].map((index) => {
                const photo = photos[index];
                const row = Math.floor(index / 2);
                const col = index % 2;
                const top = row * (currentConfig.photoHeight + currentConfig.gap);
                const left = col * (currentConfig.photoWidth + currentConfig.gap);

                return (
                    <div
                    key={index}
                    style={{
                        position: "absolute",
                        top,
                        left,
                    }}
                    >
                    {photo ? (
                        <PhotoThumbnail
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        width={currentConfig.photoWidth}
                        height={currentConfig.photoHeight}
                        className="object-cover"
                        />
                    ) : (
                        <div
                        className="flex items-center justify-center bg-gray-200 text-gray-500 rounded"
                        style={{
                            width: currentConfig.photoWidth,
                            height: currentConfig.photoHeight,
                        }}
                        >
                        No Photo
                        </div>
                    )}
                    </div>
                );
                })}

            {/* 1x4 layout */}
            {currentConfig.layout === "oneByFour" &&
                [0, 1, 2, 3].map((index) => {
                const photo = photos[index];
                const top = index * (currentConfig.photoHeight + currentConfig.gap);
                return (
                    <div
                    key={index}
                    style={{
                        position: "absolute",
                        top,
                        left: 0,
                    }}
                    >
                    {photo ? (
                        <PhotoThumbnail
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        width={currentConfig.photoWidth}
                        height={currentConfig.photoHeight}
                        className="object-cover"
                        />
                    ) : (
                        <div
                        className="flex items-center justify-center bg-gray-200 text-gray-500 rounded"
                        style={{
                            width: currentConfig.photoWidth,
                            height: currentConfig.photoHeight,
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
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                objectFit: currentConfig.layout === "oneByFour" ? "contain" : "cover",
                zIndex: 2,
                }}
            />
            )}
        </div>

        {/* Frame Type & Thumbnail Selection */}
        <div className="w-full max-w-4xl">
            <h2 className="text-xl font-semibold font-chillax mb-4">
            Choose a Frame
            </h2>
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

            {/* Thumbnail List */}
            <div className="mb-6">
            {isColorFrame ? (
                <div className="flex gap-4 overflow-x-auto flex-nowrap custom-scrollbar">
                {frames.color.map((frame) => (
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
                {frames.custom.length > 0 ? (
                    frames.custom.map((frame) => (
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

        {/* Proceed Button */}
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
