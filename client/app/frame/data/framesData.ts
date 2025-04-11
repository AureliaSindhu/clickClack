export interface Frame { 
    id: string; 
    type: "color" | "custom"; 
    src: string; 
    thumbnailSrc: string; 
    name: string; 
}

export const colorFrames: Frame[] = [
    { id: "color1", type: "color", src: "/color-frames/frame1.png", thumbnailSrc: "/color-frames/frame1-thumb.png", name: "Charcoal" },
    { id: "color2", type: "color", src: "/color-frames/frame2.png", thumbnailSrc: "/color-frames/frame2-thumb.png", name: "Deep Purple" },
    { id: "color3", type: "color", src: "/color-frames/frame3.png", thumbnailSrc: "/color-frames/frame3-thumb.png", name: "Slate" },
    { id: "color4", type: "color", src: "/color-frames/frame4.png", thumbnailSrc: "/color-frames/frame4-thumb.png", name: "Purple Gray" },
    { id: "color5", type: "color", src: "/color-frames/frame5.png", thumbnailSrc: "/color-frames/frame5-thumb.png", name: "Mountain" },
    { id: "color6", type: "color", src: "/color-frames/frame6.png", thumbnailSrc: "/color-frames/frame6-thumb.png", name: "Beige" },
    { id: "color7", type: "color", src: "/color-frames/frame7.png", thumbnailSrc: "/color-frames/frame7-thumb.png", name: "Alabaster" },
    { id: "color8", type: "color", src: "/color-frames/frame8.png", thumbnailSrc: "/color-frames/frame8-thumb.png", name: "White" },
];

export const customFrames: Frame[] = [
    { id: "custom1", type: "custom", src: "/custom-frames/cframe1.png", thumbnailSrc: "/custom-frames/cframe1-thumb.png", name: "Snow" },
    { id: "custom2", type: "custom", src: "/custom-frames/cframe2.png", thumbnailSrc: "/custom-frames/cframe2-thumb.png", name: "Pattern" },
    { id: "custom3", type: "custom", src: "/custom-frames/cframe3.png", thumbnailSrc: "/custom-frames/cframe3-thumb.png", name: "Cookies" },
    { id: "custom4", type: "custom", src: "/custom-frames/cframe4.png", thumbnailSrc: "/custom-frames/cframe4-thumb.png", name: "Town" },
    { id: "custom5", type: "custom", src: "/custom-frames/cframe5.png", thumbnailSrc: "/custom-frames/cframe5-thumb.png", name: "Table" },
    { id: "custom6", type: "custom", src: "/custom-frames/cframe6.png", thumbnailSrc: "/custom-frames/cframe6-thumb.png", name: "Tree" },
];

export const oneByFourColorFrames: Frame[] = [
    { id: "1x4-color1", type: "color", src: "/1x4/color1.png", thumbnailSrc: "/1x4/color1-thumb.png", name: "1x4 Color 1" },
    { id: "1x4-color2", type: "color", src: "/1x4/color2.png", thumbnailSrc: "/1x4/color2-thumb.png", name: "1x4 Color 2" },
];

export const oneByFourCustomFrames: Frame[] = [
    { id: "1x4-custom1", type: "custom", src: "/1x4/custom1.png", thumbnailSrc: "/1x4/custom1-thumb.png", name: "1x4 Custom 1" },
    { id: "1x4-custom2", type: "custom", src: "/1x4/custom2.png", thumbnailSrc: "/1x4/custom2-thumb.png", name: "1x4 Custom 2" },
];

// Special Ed
    export const specialEdColorFrames: Frame[] = [
    { id: "special-color1", type: "color", src: "/special-ed/news1.png", thumbnailSrc: "/special-ed/news1-thumb.png", name: "Special Ed" },
];
