"use client";

import { useState } from "react";

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

export default function FeedbackForm({ onSuccess, onError }: FeedbackFormProps) {
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
        } else if (
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
        ) {
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
    
          // Check if the response is JSON
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
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
        }  else {
            // Handle non-JSON responses
            const text = await response.text();
            console.error("Non-JSON response:", text);
            onError("An unexpected error occurred. Please try again.");
        }
    } catch (error: any) {
        console.error("Error submitting feedback:", error);
        onError("An unexpected error occurred. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
    };      

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">We Value Your Feedback</h2>
        <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
                Name<span className="text-red-500">*</span>
            </label>
            <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 border ${
                errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300`}
            />
            {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
                Email<span className="text-red-500">*</span>
            </label>
            <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300`}
            />
            {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            </div>

            {/* Rating Field */}
            <div className="mb-4">
            <label htmlFor="rating" className="block text-gray-700">
                Rating<span className="text-red-500">*</span>
            </label>
            <select
                name="rating"
                id="rating"
                value={formData.rating}
                onChange={handleChange}
                className={`mt-1 block w-full p-2 border ${
                errors.rating ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300`}
            >
                <option value="5">5 - Excellent</option>
                <option value="4">4 - Very Good</option>
                <option value="3">3 - Good</option>
                <option value="2">2 - Fair</option>
                <option value="1">1 - Poor</option>
            </select>
            {errors.rating && (
                <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
            </div>

            {/* Comments Field */}
            <div className="mb-4">
            <label htmlFor="comments" className="block text-gray-700">
                Comments/ Request<span className="text-red-500">*</span>
            </label>
            <textarea
                name="comments"
                id="comments"
                value={formData.comments}
                onChange={handleChange}
                rows={4}
                className={`mt-1 block w-full p-2 border ${
                errors.comments ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300`}
            ></textarea>
            {errors.comments && (
                <p className="text-red-500 text-sm mt-1">{errors.comments}</p>
            )}
            </div>

            {/* Submit Button */}
            <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
        </form>
        </div>
    );
}
