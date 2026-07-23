import React, { useState, useEffect } from "react";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  fallbackSrc?: string;
  alt: string;
  aspectRatio?: string; // e.g. "aspect-[3/2]", "aspect-square"
  containerClassName?: string;
  showSkeleton?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  fallbackSrc,
  alt,
  aspectRatio,
  className = "",
  containerClassName = "",
  showSkeleton = true,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoading(true);
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < 2) {
      // Automatic retry with exponential delay
      setTimeout(() => {
        setRetryCount((prev) => prev + 1);
        setCurrentSrc(`${src}?retry=${retryCount + 1}`);
      }, 1000 * (retryCount + 1));
    } else if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Fall back to lower resolution preview or alternate thumbnail
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div className={`relative overflow-hidden bg-neutral-900/40 ${aspectRatio || ""} ${containerClassName}`}>
      {/* Loading Skeleton Placeholder */}
      {showSkeleton && isLoading && (
        <div className="absolute inset-0 bg-neutral-800/60 animate-pulse flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Error State Placeholder */}
      {hasError ? (
        <div className="absolute inset-0 bg-neutral-900 border border-neutral-800/80 flex flex-col items-center justify-center p-3 text-center z-10">
          <svg className="w-6 h-6 text-neutral-600 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[10px] font-mono text-neutral-500">Image unavailable</span>
        </div>
      ) : (
        <img
          {...props}
          src={currentSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"} ${className}`}
        />
      )}
    </div>
  );
};

export default SmartImage;
