import { useEffect, useRef, useState } from "react";

type UseImageSequenceOptions = {
  /** Public path prefix, e.g. "/frames" */
  basePath: string;
  /** Total number of frames in the sequence */
  frameCount: number;
  /** Filename prefix before the zero-padded index, e.g. "frame" */
  prefix?: string;
  /** File extension including the dot, e.g. ".jpg" */
  extension?: string;
  /** Zero-padding width for the frame index, e.g. 4 -> 0001 */
  padding?: number;
};

type UseImageSequenceResult = {
  images: HTMLImageElement[];
  loadedCount: number;
  isReady: boolean;
  progress: number; // 0..1
};

/**
 * Preloads every frame of an image sequence up front so scroll-scrubbing
 * playback never hits a missing/blank frame. Frames are decoded (not just
 * fetched) before being counted as "loaded" to avoid first-paint jank.
 */
export function useImageSequence({
  basePath,
  frameCount,
  prefix = "frame",
  extension = ".jpg",
  padding = 4,
}: UseImageSequenceOptions): UseImageSequenceResult {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    imagesRef.current = new Array(frameCount);
    setLoadedCount(0);

    let loaded = 0;

    const frameSrc = (index: number) =>
      `${basePath}/${prefix}${String(index).padStart(padding, "0")}${extension}`;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = frameSrc(i);

      const markLoaded = () => {
        if (cancelled) return;
        loaded += 1;
        setLoadedCount(loaded);
      };

      // decode() gives us a fully paintable bitmap before we count the frame
      // as ready; fall back to onload for browsers without decode support.
      if (typeof img.decode === "function") {
        img
          .decode()
          .then(markLoaded)
          .catch(markLoaded); // still count it so a single bad frame can't stall the bar
      } else {
        img.onload = markLoaded;
        img.onerror = markLoaded;
      }

      imagesRef.current[i - 1] = img;
    }

    return () => {
      cancelled = true;
    };
  }, [basePath, frameCount, prefix, extension, padding]);

  const isReady = loadedCount >= frameCount;

  return {
    images: imagesRef.current,
    loadedCount,
    isReady,
    progress: frameCount > 0 ? loadedCount / frameCount : 1,
  };
}
