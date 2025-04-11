export interface Frame { 
    id: string; type: "color" | "custom"; 
    src: string; 
    thumbnailSrc: 
    string; name: string; 
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
