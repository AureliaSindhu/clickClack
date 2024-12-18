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
                    scale: 1,
                });

                const dataURL = canvas.toDataURL("image/png");
            } catch (error) {
                console.error("Error generating final image:", error);
            }
        }
    };

    // Helper function to load images
    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = document.createElement("img");
            img.crossOrigin = "anonymous"; 
            img.src = src;
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
        });
    };

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
            sHeight = img.height;
            sWidth = sHeight * targetAspect;
            sx = (img.width - sWidth) / 2;
            sy = 0;
        } else {
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
            const canvas = document.createElement("canvas");
            canvas.width = ORIGINAL_WIDTH;
            canvas.height = ORIGINAL_HEIGHT;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                throw new Error("Canvas is not supported.");
            }

            // Fill the background with transparent 
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

            loadedPhotos.forEach((img, index) => {
                const pos = photoPositions[index];
                drawImageCover(ctx, img, pos.x, pos.y, 461, 698);
            });

            ctx.drawImage(frameImg, 0, 0, ORIGINAL_WIDTH, ORIGINAL_HEIGHT);

            const dataURL = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "final-image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setDownloadSuccess(true);

        } catch (error) {
            console.error("Error generating full-size image:", error);
            alert("Failed to generate the image. Please try again.");
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

            <div className="flex space-x-4 mb-8">
                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    className="bg-[#536659] text-white py-2 px-4 rounded-lg shadow-lg hover:bg-[#356c47] transition flex items-center"
                >
                    <ImageDown className="mr-2"/>
                    Download 
                </button>

                {/* Feedback Button */}
                <button
                    onClick={handleFeedback}
                    className="bg-yellow-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-yellow-700 transition flex items-center"
                >
                    <Sticker className="mr-2"/>
                    Feedback
                </button>

                {/* Again Button */}
                <button
                    onClick={handleDoAnother}
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-gray-700 transition flex items-center"
                >
                    <RefreshCcw className="mr-2"/>
                    Again!
                </button>
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
