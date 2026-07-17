"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import "../style.css";
import { Footer } from "../../components/footer";
import { PartyPopper, ImageDown, RefreshCcw, Sticker } from "lucide-react";
import FeedbackForm from "../../components/FeedbackForm";

interface Frame {
    id: string;
    type: "color" | "custom";
    src: string;
    name: string;
}

type CollageType = "2by2" | "oneByFour" | "specialEd";
interface LayoutConfig {
    originalWidth: number;
    originalHeight: number;
    topHeight: number;     
    bottomHeight: number;   
    layout: "2by2" | "oneByFour" | "single";
    photoWidth: number;      
    photoHeight: number;    
    gap?: number;
    leftRightGap?: number;
}

const COLLAGE_CONFIGS: Record<CollageType, LayoutConfig> = {
    "2by2": {
        originalWidth: 1080,
        originalHeight: 1920,
        topHeight: 75,
        bottomHeight: 421,
        layout: "2by2",
        photoWidth: 461,
        photoHeight: 698,
        gap: 30,
        leftRightGap: 65,
    },
    oneByFour: {
        // Example: 1080 wide x 1920 tall.
        // We'll put 4 vertical photos. 
        // We set aside 100 px top + 180 px bottom => 280 total margin in height
        // That leaves 1640 px for photos. 
        // If photoHeight= 350, then 4*350=1400, plus 3 gaps (3*20=60) => 1460 total, which fits in 1640.
        originalWidth: 1080,
        originalHeight: 1920,
        topHeight: 100,
        bottomHeight: 180,
        layout: "oneByFour",
        photoWidth: 520,  // each photo is 520 wide in the original design
        photoHeight: 350, // each photo is 350 tall in the original design
        gap: 20,
        // To center a 520-wide photo in 1080 => leftover 560 => half=280
        leftRightGap: 280,
    },
    specialEd: {
        originalWidth: 1080,
        originalHeight: 1920,
        topHeight: 540,
        bottomHeight: 790,
        layout: "single",
        photoWidth: 860,  
        photoHeight: 530,
    },
};

export default function FinalizePage() {
    const router = useRouter();

    const [collageType, setCollageType] = useState<CollageType>("2by2");
    const [photos, setPhotos] = useState<string[]>([]);
    const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);
    const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [finalImageURL, setFinalImageURL] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(true);

    const finalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storedType = sessionStorage.getItem("collageType");
        if (
        storedType === "2by2" ||
        storedType === "oneByFour" ||
        storedType === "specialEd"
        ) {
        setCollageType(storedType);
        }
    }, []);

    useEffect(() => {
        const storedPhotos = sessionStorage.getItem("photos");
        if (!storedPhotos) {
        router.push(`/capture/${collageType}`);
        return;
        }

        const storedSelectedFrame = sessionStorage.getItem("selectedFrame");
        if (!storedSelectedFrame) {
        router.push("/frame");
        return;
        }

        try {
        setPhotos(JSON.parse(storedPhotos));
        setSelectedFrame(JSON.parse(storedSelectedFrame));
        } catch (error) {
        console.error("Error parsing session data:", error);
        sessionStorage.removeItem("photos");
        sessionStorage.removeItem("selectedFrame");
        router.push("/option");
        }
    }, [router, collageType]);

    const config = COLLAGE_CONFIGS[collageType];

    let scaleFactor = 0.3;
    if (collageType === "specialEd") {
        scaleFactor = 0.25;
    } else if (collageType === "oneByFour") {
        scaleFactor = 0.2;
    }

    const scaledFrameWidth = Math.round(config.originalWidth * scaleFactor);
    const scaledFrameHeight = Math.round(config.originalHeight * scaleFactor);

    const scaledTopHeight = Math.round(config.topHeight * scaleFactor);
    const scaledBottomHeight = Math.round(config.bottomHeight * scaleFactor);

    const scaledPhotoWidth = Math.round(config.photoWidth * scaleFactor);
    const scaledPhotoHeight = Math.round(config.photoHeight * scaleFactor);
    const scaledGap = config.gap ? Math.round(config.gap * scaleFactor) : 0;
    const scaledLeftRight = config.leftRightGap
        ? Math.round(config.leftRightGap * scaleFactor)
        : 0;

    useEffect(() => {
        if (photos.length > 0 && selectedFrame) {
        generateFinalImage();
        }
    }, [photos, selectedFrame]);

    const generateFinalImage = async () => {
        if (!finalRef.current) return;
        setIsGeneratingImage(true);
        try {
        const canvas = await html2canvas(finalRef.current, {
            useCORS: true,
            allowTaint: true,
            backgroundColor: "transparent",
            scale: window.devicePixelRatio || 2,
        });
        setFinalImageURL(canvas.toDataURL("image/png"));
        } catch (error) {
        console.error("Error generating final image:", error);
        } finally {
        setIsGeneratingImage(false);
        }
    };

    let photoContainerStyle: React.CSSProperties = {};
    let photoElements: JSX.Element[] = [];

    if (config.layout === "2by2") {
        // 2 x 2 grid
        const gridWidth = scaledPhotoWidth * 2 + scaledGap;
        const gridHeight = scaledPhotoHeight * 2 + scaledGap;
        photoContainerStyle = {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        columnGap: scaledGap,
        rowGap: scaledGap,
        width: gridWidth,
        height: gridHeight,
        marginLeft: scaledLeftRight,
        marginRight: scaledLeftRight,
        position: "relative",
        };
        photoElements = photos.slice(0, 4).map((photo, i) => (
        <img
            key={i}
            src={photo}
            alt={`Photo ${i + 1}`}
            className="object-cover"
            style={{
            width: scaledPhotoWidth,
            height: scaledPhotoHeight,
            }}
            onError={(e) => {
            (e.target as HTMLImageElement).src = "/fallback-image.png";
            }}
        />
        ));
    }
    else if (config.layout === "oneByFour") {
        // 1 x 4 vertical strip
        const totalPhotoHeight = 4 * scaledPhotoHeight + 3 * scaledGap;
        photoContainerStyle = {
        width: scaledPhotoWidth,
        height: totalPhotoHeight,
        marginLeft: scaledLeftRight,
        marginRight: scaledLeftRight,
        position: "relative",
        };
        photoElements = photos.slice(0, 4).map((photo, i) => {
        const topPos = i * (scaledPhotoHeight + scaledGap);
        return (
            <img
            key={i}
            src={photo}
            alt={`Photo ${i + 1}`}
            className="object-cover absolute left-0"
            style={{
                top: topPos,
                width: scaledPhotoWidth,
                height: scaledPhotoHeight,
            }}
            onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-image.png";
            }}
            />
        );
        });
    }
    // For specialEd (single)
    else {
        photoContainerStyle = {
        width: scaledPhotoWidth,
        height: scaledPhotoHeight,
        position: "relative",
        };
        if (photos[0]) {
        photoElements.push(
            <img
            key="single"
            src={photos[0]}
            alt="Special Ed Photo"
            className="object-cover absolute top-0 left-0"
            style={{
                width: scaledPhotoWidth,
                height: scaledPhotoHeight,
            }}
            onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-image.png";
            }}
            />
        );
        }
    }

    const handleDownload = () => {
        if (!finalImageURL) return;
        const link = document.createElement("a");
        link.href = finalImageURL;
        link.download = "final_image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloadSuccess(true);
    };

    const closePopup = () => {
        setDownloadSuccess(false);
    };

    const handleDoAnother = () => {
        router.push("/option");
    };

    const handleFeedback = () => {
        setIsFeedbackOpen(true);
    };

    const handleFeedbackSuccess = () => {
        setFeedbackMessage("Thank you for your feedback!");
        setIsFeedbackOpen(false);
    };

    const handleFeedbackError = (message: string) => {
        setFeedbackMessage(message);
        setIsFeedbackOpen(false);
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-[var(--canvas)] text-black p-6">
        <h1 className="text-3xl mb-6 font-chillax">Your Final Photo</h1>

        <div
            ref={finalRef}
            className="relative mb-8"
            style={{
            width: scaledFrameWidth,
            height: scaledFrameHeight,
            backgroundColor: "transparent",
            }}
        >
            {/* top gap area */}
            <div
            style={{
                width: "100%",
                height: scaledTopHeight,
                backgroundColor: "transparent",
            }}
            />

            {/* photo region */}
            <div
            className="flex-grow flex justify-center items-center"
            style={{
                height: `calc(100% - ${scaledTopHeight + scaledBottomHeight}px)`,
            }}
            >
            <div style={photoContainerStyle}>{photoElements}</div>
            </div>

            {/* bottom gap area */}
            <div
            style={{
                width: "100%",
                height: scaledBottomHeight,
                backgroundColor: "transparent",
            }}
            />

            {/* Frame overlay */}
            {selectedFrame && (
            <img
                src={selectedFrame.src}
                alt={`Frame ${selectedFrame.name}`}
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
                style={{ zIndex: 2 }}
                onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-frame.png";
                }}
            />
            )}
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 w-full max-w-md">
            <div className="flex space-x-4 justify-center">
            <button
                onClick={handleDownload}
                disabled={isGeneratingImage || !finalImageURL}
                className="bg-[#536659] text-white py-2 px-4 rounded-lg shadow-lg hover:bg-[#356c47] transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <ImageDown className="mr-2" />
                {isGeneratingImage ? "Preparing..." : "Download"}
            </button>
            <button
                onClick={handleDoAnother}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gray-700 transition flex items-center justify-center"
            >
                <RefreshCcw className="mr-2" />
                Again!
            </button>
            </div>
            <div className="flex justify-center">
            <button
                onClick={handleFeedback}
                className="bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-700 transition flex items-center justify-center"
            >
                <Sticker className="mr-2" />
                Feedback
            </button>
            </div>
        </div>

        {/* Download success popup */}
        {downloadSuccess && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[var(--canvas)] rounded-lg p-6 max-w-sm w-full text-center">
                <PartyPopper className="mx-auto mb-2" />
                <h2 className="text-xl font-semibold font-chillax">
                Download Successful!
                </h2>
                <p className="mb-2">
                Don&apos;t forget to share and tag{" "}
                <a
                    href="https://www.instagram.com/aacodee/?hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <strong> aacode </strong>
                </a>{" "}
                on Instagram.
                </p>
                <button
                onClick={closePopup}
                className="bg-[#536659] text-white py-2 px-4 rounded-lg hover:bg-[#356c47] transition"
                >
                Close
                </button>
            </div>
            </div>
        )}

        {/* Feedback Modal */}
        {isFeedbackOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="rounded-lg p-6 max-w-md w-full relative">
                <button
                onClick={() => setIsFeedbackOpen(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                aria-label="Close Feedback Form"
                >
                &times;
                </button>
                <FeedbackForm
                onSuccess={handleFeedbackSuccess}
                onError={handleFeedbackError}
                />
            </div>
            </div>
        )}

        {feedbackMessage && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
            {feedbackMessage}
            </div>
        )}

        <Footer />
        </div>
    );
}
