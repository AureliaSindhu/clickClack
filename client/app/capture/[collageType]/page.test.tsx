import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const pushMock = vi.fn();
const getScreenshotMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
    useParams: () => ({ collageType: "twoByTwo" }),
}));

vi.mock("react-webcam", () => ({
    default: React.forwardRef(function MockWebcam(_props: unknown, ref: React.Ref<unknown>) {
        React.useImperativeHandle(ref, () => ({
            getScreenshot: getScreenshotMock,
        }));
        return <div data-testid="mock-webcam" />;
    }),
}));

import CapturePage from "./page";

describe("CapturePage manual capture flow", () => {
    beforeEach(() => {
        let shot = 0;
        getScreenshotMock.mockReset();
        getScreenshotMock.mockImplementation(() => `data:image/jpeg;base64,frame-${++shot}`);
        pushMock.mockReset();
        sessionStorage.clear();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("captures exactly one screenshot per click and stores the 4 photos actually captured, without an extra redundant capture on the last shot", async () => {
        const user = userEvent.setup();
        render(<CapturePage />);

        const captureButton = screen.getByRole("button", { name: /capture photo manually/i });

        for (let i = 0; i < 4; i++) {
            await user.click(captureButton);
        }

        await waitFor(() => expect(pushMock).toHaveBeenCalledWith("/review"));

        // Exactly 4 screenshots should have been taken for 4 clicks - not 5.
        expect(getScreenshotMock).toHaveBeenCalledTimes(4);

        const stored = JSON.parse(sessionStorage.getItem("photos") || "[]");
        expect(stored).toEqual([
            "data:image/jpeg;base64,frame-1",
            "data:image/jpeg;base64,frame-2",
            "data:image/jpeg;base64,frame-3",
            "data:image/jpeg;base64,frame-4",
        ]);
        expect(sessionStorage.getItem("collageType")).toBe("twoByTwo");
    });
});
