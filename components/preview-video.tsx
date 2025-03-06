"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Video from "next-video";

interface VideoPlayerProps {
  hlsUrl: string;
  //   converToM3u8: boolean;
  onClose: () => void;
}

export const VideoPlayer = ({ hlsUrl, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpen, setIsOpen] = useState(true);

  const converToM3u8 = hlsUrl.includes(".m3u8");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!converToM3u8) {
      console.log("here" + hlsUrl);
      video.src = hlsUrl;
    } else {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
      }
    }
  }, [hlsUrl]);

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleClose}
    >
      <div
        className="w-[60%] bg-black rounded-lg overflow-hidden shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <Video ref={videoRef} controls className="w-full h-auto rounded-lg" />
      </div>
    </div>
  );
};
