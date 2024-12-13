"use client";

import { useState } from "react";
import { Star, Printer } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FeedbackData {
    name: string;
    email: string;
    rating: string;
    comments: string;
}

interface FeedbackFormProps {
    onSuccess: () => void;
    onError: (message: string) => void;
}

export default function ReceiptFeedbackForm({ onSuccess, onError }: FeedbackFormProps) {
    const [formData, setFormData] = useState<FeedbackData>({
        name: "",
        email: "",
        rating: "5",
        comments: "",
    });

    const [errors, setErrors] = useState<Partial<FeedbackData>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = (): Partial<FeedbackData> => {
        const newErrors: Partial<FeedbackData> = {};

        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.email.trim()) {
        newErrors.email = "Email is required.";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
        newErrors.email = "Invalid email address.";
        }
        if (!formData.comments.trim()) newErrors.comments = "Comments are required.";

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
        const response = await fetch("/api/feedback", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
            onSuccess();
            setFormData({
            name: "",
            email: "",
            rating: "5",
            comments: "",
            });
        } else {
            onError(result.message || "Failed to submit feedback.");
        }
        } catch (error: any) {
        console.error("Error submitting feedback:", error);
        onError("An unexpected error occurred. Please try again.");
        } finally {
        setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg overflow-hidden">
        <div className="p-6 bg-[#FFFDF7] border-t-8 border-dashed border-gray-300">
            <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 font-mono">FEEDBACK RECEIPT</h2>
            <p className="text-sm text-gray-500 font-mono">
                {new Date().toLocaleString()}
            </p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
                <Input
                type="text"
                name="name"
                placeholder="Name*"
                value={formData.name}
                onChange={handleChange}
                className={`font-mono ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
                <Input
                type="email"
                name="email"
                placeholder="Email*"
                value={formData.email}
                onChange={handleChange}
                className={`font-mono ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
                <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer ${
                        parseInt(formData.rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setFormData({ ...formData, rating: star.toString() })}
                    />
                ))}
                </div>
            </div>

            <div>
                <Textarea
                name="comments"
                placeholder="Comments / Request*"
                value={formData.comments}
                onChange={handleChange}
                rows={3}
                className={`font-mono ${errors.comments ? "border-red-500" : ""}`}
                />
                {errors.comments && <p className="text-red-500 text-xs mt-1">{errors.comments}</p>}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center"
            >
                {isSubmitting ? (
                "Printing..."
                ) : (
                <>
                    Print Feedback <Printer className="ml-2 h-4 w-4" />
                </>
                )}
            </Button>
            </form>
        </div>
        <div className="bg-[#FFFDF7] p-4 border-t border-dashed border-gray-300">
            <p className="text-center text-xs font-mono text-gray-500">
            Thank you for your feedback!
            </p>
        </div>
        </div>
    );
}

