import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ status: "error", message: "Method Not Allowed" });
    }

    const { name, email, rating, comments } = req.body;

    // Basic server-side validation
    if (!name || !email || !rating || !comments) {
        return res.status(400).json({ status: "error", message: "All fields are required." });
    }

    // Prepare data to send to Google Apps Script
    const payload = {
        name,
        email,
        rating,
        comments,
    };

    try {
        const GOOGLE_APPS_SCRIPT_URL = process.env.GOOGLE_APPS_SCRIPT_URL as string;

        const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok && result.status === "success") {
            return res.status(200).json({ status: "success", message: "Feedback submitted successfully." });
        } else {
            return res.status(500).json({ status: "error", message: result.message || "Failed to submit feedback." });
        }
    } catch (error: any) {
        console.error("Error submitting feedback:", error);
        return res.status(500).json({ status: "error", message: "Internal server error." });
    }
}
