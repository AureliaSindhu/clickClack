import React, { useState } from 'react';

interface PhotoThumbnailProps {
    src: string;
    alt: string;
    width?: string | number;
    height?: string | number;
    className?: string;
    style?: React.CSSProperties;
    fallbackSrc?: string;
}

const PhotoThumbnail: React.FC<PhotoThumbnailProps> = ({
    src,
    alt,
    width,
    height,
    className = '',
    style,
    fallbackSrc = '/fallback-image.png'
    }) => {
    const [imgSrc, setImgSrc] = useState(src);

    const handleError = () => {
        setImgSrc(fallbackSrc);
    };

    return (
        <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={style}
        onError={handleError}
        />
    );
};

export default PhotoThumbnail;
