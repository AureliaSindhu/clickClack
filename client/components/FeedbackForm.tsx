"use client";

import React, { useState } from "react";
import { Star, Printer } from 'lucide-react';
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea"; 
import { Button } from "./ui/button";

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

const ReceiptFeedbackForm: React.FC<FeedbackFormProps> = ({ onSuccess, onError }) => {
    const [formData, setFormData] = useState<FeedbackData>({
        name: "",
        email: "",
        rating: "5",
        comments: "",
    });

    const [errors, setErrors] = useState<Partial<FeedbackData>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear only the field being edited to avoid stale error text.
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const validate = (): Partial<FeedbackData> => {
        const newErrors: Partial<FeedbackData> = {};
        if (!formData.name.trim()) newErrors.name = "Name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
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
    
        const googleFormURL = "https://docs.google.com/forms/d/e/1FAIpQLScHB2JEnqEvHDG5TApLWXHwc8xtRmIVC9oIYxmVuGsjzVI5qA/formResponse";
        const formMapping = {
            "entry.339916220": formData.name,     
            "entry.885419918": formData.email,    
            "entry.1810681366": formData.rating,  
            "entry.1628403147": formData.comments, 
        };
    
        const formDataToSubmit = new FormData();
        Object.entries(formMapping).forEach(([key, value]) => {
            formDataToSubmit.append(key, value);
        });
    
        try {
            await fetch(googleFormURL, {
                method: "POST",
                mode: "no-cors",  
                body: formDataToSubmit,
            });

            // no-cors responses are opaque, so treat a resolved fetch as success.
            onSuccess();
            setFormData({
                name: "",
                email: "",
                rating: "5",
                comments: "",
            });
            setIsSubmitted(true);
        } catch (error) {
            if (error instanceof Error) {
                console.error("Error submitting feedback:", error);
                onError(error.message);
            } else {
                console.error("An unexpected error occurred:", error);
                onError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="max-w-md mx-auto bg-[#EAE6E0] rounded-lg shadow-lg overflow-hidden p-6 text-center">
                <h2 className="text-2xl font-bold mb-2 font-mono">Thank You!</h2>
                <p className="text-sm text-gray-500 font-mono">
                    Your feedback has been submitted successfully.
                </p>
                <Button
                    onClick={() => setIsSubmitted(false)} 
                    className="mt-4 bg-black text-white hover:bg-gray-800"
                >
                    Submit Another Feedback
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto shadow-lg overflow-hidden">
            <div className="p-6 bg-[#EAE6E0] border-t-8 border-dashed border-gray-800">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold mb-2 font-chillax">FEEDBACK RECEIPT</h2>
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
                            className={`font-mono p-2 ${errors.name ? "border-red-500" : ""}`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            type="email"
                            name="email"
                            placeholder="Email*"
                            value={formData.email}
                            onChange={handleChange}
                            className={`font-mono p-2 ${errors.email ? "border-red-500" : ""}`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                    onClick={() =>
                                        setFormData((prev) => ({ ...prev, rating: star.toString() }))
                                    }
                                >
                                    <Star
                                        className={`w-6 h-6 cursor-pointer ${
                                            Number.parseInt(formData.rating, 10) >= star
                                                ? "text-yellow-500 fill-yellow-500"
                                                : "text-gray-400"
                                        }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <Textarea
                            name="comments"
                            placeholder="Comments or Request*"
                            value={formData.comments}
                            onChange={handleChange}
                            rows={3}
                            className={`font-mono p-2 ${errors.comments ? "border-red-500" : ""}`}
                        />
                        {errors.comments && (
                            <p className="text-red-500 text-xs mt-1">{errors.comments}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center"
                    >
                        {isSubmitting ? (
                            "Submitting..."
                        ) : (
                            <>
                                Submit Feedback <Printer className="ml-2 h-4 w-4" />
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
};

export default ReceiptFeedbackForm;
