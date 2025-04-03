"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "../../components/footer";
import { RefreshCcw, ChevronRight } from "lucide-react";
import PhotoThumbnail from "../../components/PhotoThumbnail";
import { collageConfigs } from "../capture/collageConfigs";
import "../style.css";

export default function ReviewPage() {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [gridClass, setGridClass] = useState("grid-cols-2");
    const [thumbnailDimensions, setThumbnailDimensions] = useState({ width: 138, height: 209 });

    useEffect(() => {
        const storedPhotos = sessionStorage.getItem("photos");
        if (storedPhotos) {
        setPhotos(JSON.parse(storedPhotos));
        } else {
        const collageType = sessionStorage.getItem("collageType") || "twoByTwo";
        router.push(`/capture/${collageType}`);
        return;
        }

        const storedCollageType = sessionStorage.getItem("collageType") || "twoByTwo";
        const config =
        collageConfigs[storedCollageType as keyof typeof collageConfigs] ||
        collageConfigs.twoByTwo;

        setGridClass(config.reviewGridClass || "grid-cols-2");

        const { videoConstraints } = config;
        const computedWidth = videoConstraints.height * videoConstraints.aspectRatio;
        const computedHeight = videoConstraints.height;
        const scaleFactor = 0.1;
        setThumbnailDimensions({
        width: computedWidth * scaleFactor,
        height: computedHeight * scaleFactor,
        });
    }, [router]);

    const handleRetakeAll = () => {
        setPhotos([]);
        sessionStorage.removeItem("photos");
        sessionStorage.removeItem("collageType");
        router.push("/capture");
    };

    const handleProceed = () => {
        router.push("/frame");
    };

    return (
        <div className="min-h-screen flex flex-col bg-[var(--canvas)]">
        <div className="flex-grow flex flex-col items-center justify-center p-10">
            <h1 className="text-2xl mb-6 text-black font-chillax">Review Your Photos</h1>
            <div className={`grid ${gridClass} gap-4`}>
            {photos.map((photo, index) => (
                <div key={index} className="flex flex-col items-center">
                {photo ? (
                    <PhotoThumbnail
                    src={photo}
                    alt={`Captured photo number ${index + 1}`}
                    style={{ width: thumbnailDimensions.width, height: thumbnailDimensions.height }}
                    className="object-cover rounded-md mb-2"
                    />
                ) : (
                    <div
                    style={{ width: thumbnailDimensions.width, height: thumbnailDimensions.height }}
                    className="bg-gray-200 rounded-md flex items-center justify-center mb-2"
                    >
                    <p className="text-gray-500">Empty</p>
                    </div>
                )}
                </div>
            ))}
            </div>
            <div className="flex space-x-4 mt-6">
            <button
                onClick={handleRetakeAll}
                className="p-3 bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-[#7f743e] transition flex items-center justify-center"
            >
                Retake <RefreshCcw className="ml-2" />
            </button>
            <button
                onClick={handleProceed}
                className="p-3 bg-green-600 text-white rounded-lg shadow-lg hover:bg-[#536659] transition flex items-center justify-center"
                disabled={photos.length === 0}
            >
                Continue <ChevronRight className="ml-2" />
            </button>
            </div>
        </div>
        <Footer />
        </div>
    );
}
