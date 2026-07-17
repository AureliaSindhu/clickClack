import { describe, expect, it } from "vitest";
import { mapCollageType } from "./mapCollageType";

describe("mapCollageType", () => {
    it("maps 2x2 aliases, including the legacy '2by2' value used by frame/finalize pages, to 'twoByTwo'", () => {
        expect(mapCollageType("twoByTwo")).toBe("twoByTwo");
        expect(mapCollageType("two-by-two")).toBe("twoByTwo");
        expect(mapCollageType("2by2")).toBe("twoByTwo");
    });

    it("maps one-by-four aliases to 'oneByFour'", () => {
        expect(mapCollageType("oneByFour")).toBe("oneByFour");
        expect(mapCollageType("one-by-four")).toBe("oneByFour");
    });

    it("maps special-ed aliases to 'specialEd'", () => {
        expect(mapCollageType("specialEd")).toBe("specialEd");
        expect(mapCollageType("special-ed")).toBe("specialEd");
    });
});
