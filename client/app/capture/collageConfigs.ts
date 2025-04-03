export const collageConfigs = {
    twoByTwo: {
        captureCount: 4,
        videoConstraints: {
            facingMode: 'user',
            aspectRatio: 9 / 16,
            height: 1280,
        },
        containerClassName: 'webcam-container-twoByTwo',
        reviewGridClass: 'grid-cols-2',
    },
    oneByFour: {
        captureCount: 4,
        videoConstraints: {
            facingMode: 'user',
            aspectRatio: 16 / 9,
            height: 1080,
        },
        containerClassName: 'webcam-container-oneByFour',
        reviewGridClass: 'grid-cols-1',
    },
    specialEd: {
        captureCount: 1,
        videoConstraints: {
            facingMode: 'user',
            aspectRatio: 16 / 9,
            height: 487,
        },
        containerClassName: 'webcam-container-specialEd',
        reviewGridClass: 'grid-cols-1',
    }
}