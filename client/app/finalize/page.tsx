"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import '../style.css';
import Footer from "../../components/footer";
import { PartyPopper, ImageDown, RefreshCcw, Sticker } from "lucide-react";
import FeedbackForm from "../../components/FeedbackForm";

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
    const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false); 
    const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
    const [feedbackMessage, setFeedbackMessage] = useState<string>(""); 
    const [finalImageURL, setFinalImageURL] = useState<string | null>(null); // New state for dataURL

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
            try {
                const canvas = await html2canvas(finalRef.current, {
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: "transparent",
                    scale: window.devicePixelRatio || 2,
                });

                const dataURL = canvas.toDataURL("image/png");
                setFinalImageURL(dataURL); // Store dataURL in state
                console.log("Final image generated and stored in state.");
            } catch (error) {
                console.error("Error generating final image:", error);
            }
        }
    };

    // ... rest of your code remains unchanged

    const handleDownload = () => {
        if (finalImageURL) {
            const link = document.createElement("a");
            link.href = finalImageURL;
            link.download = "final_image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setDownloadSuccess(true);
        }
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
                                loading="lazy"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/fallback-image.png"; // Provide a fallback image
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

            {/* Optional: Display the final image preview if needed
            {finalImageURL && (
                <div className="mb-8">
                    <h2 className="text-2xl mb-2">Preview:</h2>
                    <img
                        src={finalImageURL}
                        alt="Final Image Preview"
                        className="w-full max-w-md border rounded shadow"
                    />
                </div>
            )} */}

            <div className="flex flex-col gap-4 w-full max-w-md">
                {/* First row: Download and Again */}
                <div className="flex space-x-4 justify-center">
                    <button
                        onClick={handleDownload}
                        className="bg-[#536659] text-white py-2 px-4 rounded-lg shadow-lg hover:bg-[#356c47] transition flex items-center justify-center"
                    >
                        <ImageDown className="mr-2" />
                        Download
                    </button>
                    <button
                        onClick={handleDoAnother}
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gray-700 transition flex items-center justify-center"
                    >
                        <RefreshCcw className="mr-2" />
                        Again!
                    </button>
                </div>
                {/* Second row: Feedback */}
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

            {/* Success Popup */}
            {downloadSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-[var(--canvas)] rounded-lg p-6 max-w-sm w-full text-center">
                        <PartyPopper className="mx-auto mb-2"/>
                        <h2 className="text-xl font-semibold font-chillax">Download Successful!</h2>
                        <p className="mb-2">Don&apos;t forget to share and tag 
                            <a href="https://www.instagram.com/aacodee/?hl=en" target="_blank" rel="noopener noreferrer">
                                <strong> aacode </strong> 
                            </a>
                        on Instagram.</p>
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

            {/* Feedback Message */}
            {feedbackMessage && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg">
                    {feedbackMessage}
                </div>
            )}

            <Footer />
        </div>
    );
}
