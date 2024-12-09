"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import "../style.css";
import Footer from "../../components/footer";

// ProgressIndicator Component
const ProgressIndicator = ({ current, total }: { current: number; total: number }) => {
    return (
        <div className="flex space-x-2 mb-4">
            {Array.from({ length: total }, (_, index) => (
                <div
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 ${
                        index < current
                            ? "bg-[#536659] border-[#536659]"
                            : "bg-transparent border-gray-300"
                    }`}
                />
            ))}
        </div>
    );
};

export default function CapturePage() {
    const webcamRef = useRef<Webcam>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [isTimedCapture, setIsTimedCapture] = useState<boolean>(false);
    const [countdown, setCountdown] = useState<number>(0);
    const [isCapturing, setIsCapturing] = useState<boolean>(false);
    const router = useRouter();
    const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
    const nextCaptureTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const captureCountRef = useRef<number>(0); // Tracks the number of captures

    const CAPTURE_COUNT = 4; // Total number of photos to capture
    const INTERVAL_SECONDS = 5; // Interval between captures in seconds

    /**
     * Function to capture a photo and update state.
     * Increments the capture count reference once per capture.
     */
    const capturePhoto = () => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setPhotos((prevPhotos) => {
                    const updatedPhotos = [...prevPhotos, imageSrc];
                    if (updatedPhotos.length === CAPTURE_COUNT) {
                        sessionStorage.setItem("photos", JSON.stringify(updatedPhotos));
                        router.push("/review");
                    }
                    return updatedPhotos;
                });
                // Increment capture count ref once per capture
                captureCountRef.current += 1;
                console.log(`Captured photo ${captureCountRef.current}`);
            } else {
                console.error("Failed to capture screenshot");
            }
        } else {
            console.error("Webcam reference is not initialized");
        }
    };

    /**
     * Function to initiate the timed capture sequence.
     * Captures photos at defined intervals until the desired count is reached.
     */
    const startTimedCapture = () => {
        if (isCapturing || captureCountRef.current >= CAPTURE_COUNT) return; // Prevent multiple timers or over-capturing
        setIsTimedCapture(true);
        setIsCapturing(true);
        handleTimedCapture();
    };

    /**
     * Recursive function to handle each step of the timed capture.
     * Sets a countdown, captures a photo when the countdown reaches zero,
     * and schedules the next capture.
     */
    const handleTimedCapture = () => {
        if (captureCountRef.current >= CAPTURE_COUNT) {
            setIsCapturing(false);
            setIsTimedCapture(false);
            console.log("All photos captured. Redirecting to review page.");
            return;
        }

        setCountdown(INTERVAL_SECONDS);
        console.log(`Starting countdown for photo ${captureCountRef.current + 1}`);

        // Start countdown
        countdownTimerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev > 1) {
                    return prev - 1;
                } else {
                    // Time to capture the photo
                    clearInterval(countdownTimerRef.current as NodeJS.Timeout);
                    countdownTimerRef.current = null;

                    capturePhoto();

                    if (captureCountRef.current < CAPTURE_COUNT) {
                        // Schedule next capture after a short delay to allow webcam to update
                        nextCaptureTimeoutRef.current = setTimeout(() => {
                            handleTimedCapture();
                        }, 1000); // 1 second delay
                        console.log("Scheduled next capture after 1 second.");
                    } else {
                        // Completed capturing all photos
                        setIsCapturing(false);
                        setIsTimedCapture(false);
                        console.log("Completed all captures. Redirecting to review page.");
                    }

                    return 0;
                }
            });
        }, 1000);
    };

    /**
     * Function to cancel the timed capture process.
     * Clears all active timers and resets relevant states.
     */
    const cancelTimedCapture = () => {
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        if (nextCaptureTimeoutRef.current) {
            clearTimeout(nextCaptureTimeoutRef.current);
            nextCaptureTimeoutRef.current = null;
        }
        setIsCapturing(false);
        setIsTimedCapture(false);
        setCountdown(0);
        console.log("Timed capture canceled by the user.");
    };

    /**
     * Cleanup effect to ensure all timers are cleared when the component unmounts.
     */
    useEffect(() => {
        return () => {
            if (countdownTimerRef.current) {
                clearInterval(countdownTimerRef.current);
            }
            if (nextCaptureTimeoutRef.current) {
                clearTimeout(nextCaptureTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--canvas)] p-6">
            <h1 className="text-2xl mb-6 text-[var(--charcoal)] font-chillax">Capture Your Photos</h1>

            {/* Progress Indicator */}
            <ProgressIndicator current={photos.length} total={CAPTURE_COUNT} />

            {/* Webcam Container */}
            <div
                className="w-[39.375vh] h-[70vh] bg-[var(--charcoal)] rounded-lg overflow-hidden mb-6 flex items-center justify-center relative"
            >
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    className="w-full h-full object-cover"
                    videoConstraints={{
                        width: 1080,
                        height: 1920,
                        facingMode: "user",
                    }}
                />

                {/* Countdown and Capture Count Overlay */}
                {isCapturing && countdown > 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
                        {/* Countdown Timer */}
                        <span className="text-white text-6xl font-bold mb-4">{countdown}</span>
                        {/* Capture Count */}
                        <span className="text-white text-xl">
                            Photo {captureCountRef.current + 1} of {CAPTURE_COUNT}
                        </span>
                    </div>
                )}
            </div>

            {/* Capture Mode Selection */}
            <div className="flex space-x-4 mb-6">
                {/* Manual Capture Button */}
                <button
                    onClick={() => {
                        if (isCapturing) return;
                        setIsTimedCapture(false);
                    }}
                    className={`px-4 py-2 rounded-lg shadow ${
                        !isTimedCapture
                            ? "bg-[#536659] text-white hover:bg-[#356c47]"
                            : "bg-gray-300 text-gray-700 cursor-not-allowed"
                    } transition`}
                    disabled={isTimedCapture}
                >
                    Manual Capture
                </button>

                {/* Timed Capture Button */}
                <button
                    onClick={startTimedCapture}
                    className={`px-4 py-2 rounded-lg shadow ${
                        isTimedCapture || isCapturing
                            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                            : "bg-[#536659] text-white hover:bg-[#356c47]"
                    } transition`}
                    disabled={isTimedCapture || isCapturing || captureCountRef.current >= CAPTURE_COUNT}
                >
                    Timed Capture
                </button>
            </div>

            {/* Capture Controls */}
            {!isTimedCapture && (
                <button
                    onClick={capturePhoto}
                    className={`px-6 py-3 bg-[#536659] text-white rounded-lg shadow-lg hover:bg-[#356c47] transition ${
                        photos.length === CAPTURE_COUNT ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={photos.length === CAPTURE_COUNT}
                >
                    {photos.length < CAPTURE_COUNT ? `Capture Photo ${photos.length + 1}` : "Completed"}
                </button>
            )}

            {isTimedCapture && isCapturing && (
                <button
                    onClick={cancelTimedCapture}
                    className="mt-4 px-6 py-3 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition"
                >
                    Cancel Timed Capture
                </button>
            )}

            {/* Photo Count */}
            <p className="text-gray-500 mt-4">
                {photos.length}/{CAPTURE_COUNT} photos captured
            </p>

            <Footer />
        </div>
    );
}