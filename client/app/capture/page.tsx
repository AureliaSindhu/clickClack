'use client';

import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '../../components/footer';
import { Camera, Clock } from 'lucide-react';
import "../style.css"

const CAPTURE_COUNT = 4;
const INTERVAL_SECONDS = 5;

const ProgressIndicator = ({ current, total }: { current: number; total: number }) => (
  <Progress value={(current / total) * 100} className="w-full mb-4" />
);

export default function CapturePage() {
    const webcamRef = useRef<Webcam>(null);
    const [photos, setPhotos] = useState<string[]>([]);
    const [countdown, setCountdown] = useState<number>(0);
    const [isCapturing, setIsCapturing] = useState<boolean>(false);
    const [captureMode, setCaptureMode] = useState<'manual' | 'timed'>('manual');
    const router = useRouter();
    const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

    const capturePhoto = () => {
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
    };

    /**
     * Function to initiate the timed capture sequence.
     */
    const startCapture = () => {
        if (isCapturing || photos.length >= CAPTURE_COUNT) return;
        setIsCapturing(true);
        if (captureMode === 'timed') {
        setCountdown(INTERVAL_SECONDS);
        } else {
        capturePhoto();
        }
    };

    /**
     * Function to cancel the timed capture process.
     * Clears all active timers and resets relevant states.
     */

    const cancelCapture = () => {
        if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
        countdownTimerRef.current = null;
        }
        setIsCapturing(false);
        setCountdown(0);
        console.log("Timed capture canceled by the user.");
    };

    /**
     * Effect to handle the countdown and capturing process.
     */
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
            setIsCapturing(false);
            }
        }
        }

        return () => {
        if (countdownTimerRef.current) {
            clearTimeout(countdownTimerRef.current);
        }
        };
    }, [isCapturing, countdown, photos.length, captureMode]);

    useEffect(() => {
        if (photos.length === CAPTURE_COUNT) {
        sessionStorage.setItem('photos', JSON.stringify(photos));
        router.push('/review');
        }
    }, [photos.length, router, photos]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--canvas)] p-6">
        <Card className="w-full max-w-md p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center">Capture Your Photos</h1>
            <ProgressIndicator current={photos.length} total={CAPTURE_COUNT} />
            <div className="relative aspect-[9/16] w-full bg-black rounded-lg overflow-hidden">
            <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="absolute inset-0 w-full h-full object-cover"
                videoConstraints={{
                width: 1080,
                height: 1920,
                facingMode: 'user',
                }}
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
            <Tabs defaultValue="manual" onValueChange={(value) => setCaptureMode(value as 'manual' | 'timed')}>
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="timed">Timed</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
                <Button onClick={startCapture} className="w-full" disabled={isCapturing || photos.length === CAPTURE_COUNT}>
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo {photos.length + 1}
                </Button>
            </TabsContent>
            <TabsContent value="timed">
                {!isCapturing ? (
                <Button onClick={startCapture} className="w-full" disabled={photos.length === CAPTURE_COUNT}>
                    <Clock className="mr-2 h-4 w-4" />
                    Start Timed Capture
                </Button>
                ) : (
                <Button onClick={cancelCapture} variant="destructive" className="w-full">
                    Cancel Capture
                </Button>
                )}
            </TabsContent>
            </Tabs>
            <p className="text-center text-muted-foreground">
            {photos.length}/{CAPTURE_COUNT} photos captured
            </p>
        </Card>
        <Footer />
        </div>
    );
}
