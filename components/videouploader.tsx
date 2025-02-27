import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Hls from "hls.js";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

const server = process.env.NEXT_PUBLIC_BASE_URL;

const VideoUploader = () => {
  const [progress, setProgress] = useState(0);
  const [convertToM3u8, setConvertToM3u8] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState("");
  const fileRef = useRef<File | null>(null);
  const uniqueId = uuidv4();
  const identifierRef = useRef(uniqueId);

  const splitFile = (file: File): Blob[] => {
    const chunks: Blob[] = [];
    let start = 0;

    while (start < file.size) {
      const end = Math.min(start + CHUNK_SIZE, file.size);
      chunks.push(file.slice(start, end));
      start = end;
    }

    return chunks;
  };

  const uploadChunk = async (chunk: Blob, index: number, total: number) => {
    const reader = new FileReader();
    reader.readAsDataURL(chunk);

    await new Promise((resolve) => (reader.onload = resolve));

    return axios.post(server + "/api/videos/upload-chunk", {
      chunk: (reader.result as string).split(",")[1],
      identifier: identifierRef.current,
      chunkIndex: index,
      totalChunks: total,
    });
  };

  const handleUpload = async (file: File) => {
    fileRef.current = file;
    const chunks = splitFile(file);

    try {
      await Promise.all(
        chunks.map((chunk, index) => uploadChunk(chunk, index, chunks.length))
      );

      const response = await axios.post(server + "/api/videos/merge-chunks", {
        identifier: identifierRef.current,
        fileName: file.name,
        convertToM3u8,
      });

      console.log({ respo: response.data });

      const filejpath = `http://localhost:5000${response.data.data.url}`;
      setPlaybackUrl(filejpath);
      setProgress(100);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />

      {progress > 0 && (
        <div>
          <progress value={progress} max="100" />
          <span>{progress}%</span>
        </div>
      )}

      {playbackUrl && (
        <VideoPlayer converToM3u8={convertToM3u8} hlsUrl={playbackUrl} />
      )}
    </div>
  );
};

interface VideoPlayerProps {
  converToM3u8: boolean;
  hlsUrl: string;
}

export const VideoPlayer = ({ hlsUrl, converToM3u8 }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  console.log({ hlsUrl });
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!converToM3u8) {
      console.log({ hlsUrl });
      video.src = hlsUrl;
    } else {
      if ("MediaSource" in window) {
        const hls = new Hls();
        hls.loadSource(hlsUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
      }
    }
  }, [hlsUrl]);

  return (
    <video
      className="absolute top-0 bottom-0 left-0 right-0 w-full h-screen"
      ref={videoRef}
      controls
      style={{ width: "100%" }}
    />
  );
};

export default VideoUploader;
