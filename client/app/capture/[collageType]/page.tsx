"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Footer } from '../../../components/footer';
import { Camera, Clock } from 'lucide-react';
import "../../style.css";
import { collageConfigs } from '../collageConfigs';
import { mapCollageType } from '../mapCollageType';

export default function CapturePage() {
    const params = useParams();
    const rawCollageType = Array.isArray(params.collageType)
        ? params.collageType[0]
        : params.collageType || '';
    const effectiveCollageType = rawCollageType ? mapCollageType(rawCollageType) : 'twoByTwo';
    const config = collageConfigs[effectiveCollageType] || collageConfigs.twoByTwo;

    const CAPTURE_COUNT = config.captureCount;
    const videoConstraints = config.videoConstraints;
    const containerClass = config.containerClassName;

    const webcamClassName =
        effectiveCollageType === 'twoByTwo'
        ? "rounded-2xl object-cover w-auto h-full ml-auto mr-auto"
        : "rounded-2xl object-cover w-full h-auto ml-auto mr-auto";

    const containerClasses =
        effectiveCollageType === 'twoByTwo'
        ? `overflow-hidden h-[65vh] w-full relative ${containerClass}`
        : `overflow-hidden h-[65vh] w-full relative flex items-center justify-center ${containerClass}`;

    const webcamRef = useRef<Webcam>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [countdown, setCountdown] = useState<number>(0);
    const [isCapturing, setIsCapturing] = useState<boolean>(false);
    const [captureMode, setCaptureMode] = useState<'manual' | 'timed'>('manual');
    const router = useRouter();
    const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Finalize captures and store both photos and the collage type
    const finalizeCaptures = useCallback(
        (finalPhotos: string[]) => {
        if (finalPhotos.length >= CAPTURE_COUNT) {
            sessionStorage.setItem('photos', JSON.stringify(finalPhotos.slice(0, CAPTURE_COUNT)));
            sessionStorage.setItem('collageType', effectiveCollageType);
            router.push('/review');
        }
        },
        [CAPTURE_COUNT, router, effectiveCollageType]
    );

    // Captures a single screenshot and, once CAPTURE_COUNT is reached, finalizes
    // using that same photo array (avoids taking a second, redundant screenshot).
    const capturePhoto = useCallback(() => {
        if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            setPhotos((prevPhotos) => {
            const newPhotos = [...prevPhotos, imageSrc];
            if (newPhotos.length >= CAPTURE_COUNT) {
                finalizeCaptures(newPhotos);
                setIsCapturing(false);
            }
            return newPhotos;
            });
        } else {
            console.error("Failed to capture screenshot");
        }
        } else {
        console.error("Webcam reference is not initialized");
        }
    }, [CAPTURE_COUNT, finalizeCaptures]);

    const startCapture = (mode: 'manual' | 'timed') => {
        if (isCapturing || photos.length >= CAPTURE_COUNT) return;
        setCaptureMode(mode);

        if (mode === 'timed') {
        setIsCapturing(true);
        setCountdown(5);
        } else {
        capturePhoto();
        }
    };

    const cancelCapture = () => {
        if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
        countdownTimerRef.current = null;
        }
        setIsCapturing(false);
        setCountdown(0);
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
            setCountdown(5);
            }
        }
        }

        return () => {
        if (countdownTimerRef.current) {
            clearTimeout(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
        };
    }, [isCapturing, countdown, photos.length, captureMode, capturePhoto, CAPTURE_COUNT]);

    // Clear previous photos on mount if needed.
    useEffect(() => {
        sessionStorage.removeItem('photos');
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[--canvas] p-6">
        <Card className="w-full max-w-md space-y-4 shadow-none bg-[--canvas]">
            <h1 className="text-2xl font-chillax text-center">Capture Your Photos</h1>
            <p className="text-center text-muted-foreground">
            {photos.length}/{CAPTURE_COUNT} photos captured
            </p>
            <div className={containerClasses}>
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className={webcamClassName}
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
