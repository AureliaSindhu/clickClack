import React from "react";
import { render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

import ReviewPage from "./page";

describe("ReviewPage session data recovery", () => {
    beforeEach(() => {
        pushMock.mockReset();
        sessionStorage.clear();
    });

    it("redirects to /option instead of crashing when stored photos are corrupted JSON", async () => {
        sessionStorage.setItem("photos", "{not valid json");
        sessionStorage.setItem("collageType", "twoByTwo");

        render(<ReviewPage />);

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/option"));
        expect(sessionStorage.getItem("photos")).toBeNull();
    });

    it("redirects to /option when no collage type has been recorded yet", async () => {
        sessionStorage.setItem("photos", JSON.stringify(["a", "b"]));

        render(<ReviewPage />);

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/option"));
    });

    it("redirects to the matching capture route when photos are missing but a collage type is known", async () => {
        sessionStorage.setItem("collageType", "twoByTwo");

        render(<ReviewPage />);

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/capture/twoByTwo"));
    });
});
