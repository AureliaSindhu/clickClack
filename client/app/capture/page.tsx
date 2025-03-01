"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Footer from '../../components/footer';
import { Camera, Clock } from 'lucide-react';
import "../style.css";

const CAPTURE_COUNT = 4;
const INTERVAL_SECONDS = 5;

export default function CapturePage() {
    const webcamRef = useRef<Webcam>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [countdown, setCountdown] = useState<number>(0);
    const [isCapturing, setIsCapturing] = useState<boolean>(false);
    const [captureMode, setCaptureMode] = useState<'manual' | 'timed'>('manual');
    const router = useRouter();
    const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

    const videoConstraints = {
        facingMode: 'user',
        aspectRatio: 9 / 16,
        height: 1280,
    };

    const capturePhoto = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setPhotos((prevPhotos) => [...prevPhotos, imageSrc]);
                console.log(`Captured photo ${photos.length + 1}`);
            } else {
                console.error("Failed to capture screenshot");
            }
        } else {
            console.error("Webcam reference is not initialized");
        }
    }, [photos.length]);

    const finalizeCaptures = (finalPhotos: string[]) => {
        if (finalPhotos.length >= CAPTURE_COUNT) {
            // Store photos in sessionStorage
            sessionStorage.setItem('photos', JSON.stringify(finalPhotos.slice(0, CAPTURE_COUNT)));
            // Navigate to the ReviewPage
            router.push('/review');
        }
    };

    const startCapture = (mode: 'manual' | 'timed') => {
        console.log(`Starting capture in ${mode} mode.`);
        if (isCapturing || photos.length >= CAPTURE_COUNT) return;
        setCaptureMode(mode);

        if (mode === 'timed') {
            setIsCapturing(true); 
            setCountdown(INTERVAL_SECONDS);
            console.log(`Timed capture initiated with countdown ${INTERVAL_SECONDS} seconds.`);
        } else {
            capturePhoto();
            if (photos.length + 1 >= CAPTURE_COUNT) {
                finalizeCaptures([...photos, webcamRef.current?.getScreenshot() || '']);
            }
        }
    };

    const cancelCapture = () => {
        if (countdownTimerRef.current) {
            clearTimeout(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        setIsCapturing(false);
        setCountdown(0);
        console.log("Timed capture canceled by the user.");
    };

    useEffect(() => {
        if (captureMode === 'timed' && isCapturing) {
            if (countdown > 0) {
                countdownTimerRef.current = setTimeout(() => {
                    setCountdown((prev) => prev - 1);
                }, 1000);
            } else {
                capturePhoto();
                if (photos.length + 1 < CAPTURE_COUNT) {
                    setCountdown(INTERVAL_SECONDS);
                } else {
                    finalizeCaptures([...photos, webcamRef.current?.getScreenshot() || '']);
                }
            }
        }

        return () => {
            if (countdownTimerRef.current) {
                clearTimeout(countdownTimerRef.current);
                countdownTimerRef.current = null;
            }
        };
    }, [isCapturing, countdown, photos.length, captureMode, capturePhoto]);

    useEffect(() => {
        // Clear existing photos when visiting the CapturePage
        sessionStorage.removeItem('photos');
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--canvas)] p-6">
            <Card className="w-full max-w-md space-y-4 shadow-none">
                <h1 className="text-2xl font-chillax text-center">Capture Your Photos</h1>
                <p className="text-center text-muted-foreground">
                    {photos.length}/{CAPTURE_COUNT} photos captured
                </p>

                <div className="webcam-container">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="webcam-video"
                        videoConstraints={videoConstraints}
                        mirrored={true}  
                    />
                    {captureMode === 'timed' && isCapturing && countdown > 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
                            <span className="text-6xl font-bold mb-4">{countdown}</span>
                            <span className="text-xl">
                                Photo {photos.length + 1} of {CAPTURE_COUNT}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex justify-center space-x-4 w-1/2 mx-auto">
                    <Button 
                        onClick={() => startCapture('manual')} 
                        className="flex-1 bg-[var(--charcoal)] text-primary-foreground hover:bg-primary/90 rounded-full shadow-none" 
                        disabled={isCapturing || photos.length >= CAPTURE_COUNT}
                        aria-label="Capture photo manually"
                    >
                        <Camera className="h-6 w-6 mx-auto" />
                    </Button>
                    <Button 
                        onClick={() => startCapture('timed')} 
                        className="flex-1 bg-[var(--charcoal)] text-primary-foreground hover:bg-primary/90 rounded-full shadow-none" 
                        disabled={isCapturing || photos.length >= CAPTURE_COUNT}
                        aria-label="Capture photo with timed mode"
                    >
                        <Clock className="h-6 w-6 mx-auto" />
                    </Button>
                </div>
                {isCapturing && captureMode === 'timed' && (
                    <div className="w-full flex justify-center mt-4 px-2 md:px-0">
                        <Button 
                            onClick={cancelCapture} 
                            variant="destructive" 
                            className="w-full bg-red-700 text-white hover:bg-red-900 rounded-full shadow-none"
                            aria-label="Cancel capture"
                        >
                            Cancel Capture
                        </Button>
                    </div>
                )}
            </Card>
            <Footer />
        </div>
    );
}
