// import axios from "axios";

// const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
// const server = "http://localhost:5000";

// const splitFile = (file: File): Blob[] => {
//   const chunks: Blob[] = [];
//   let start = 0;

//   while (start < file.size) {
//     const end = Math.min(start + CHUNK_SIZE, file.size);
//     chunks.push(file.slice(start, end));
//     start = end;
//   }

//   return chunks;
// };

// const uploadChunk = async (
//   chunk: Blob,
//   index: number,
//   total: number,
//   identifier: string
// ) => {
//   const reader = new FileReader();
//   reader.readAsDataURL(chunk);

//   await new Promise((resolve) => (reader.onload = resolve));

//   return axios.post(`${server}/api/videos/upload-chunk`, {
//     chunk: (reader.result as string).split(",")[1],
//     identifier,
//     chunkIndex: index,
//     totalChunks: total,
//   });
// };

// export const uploadVideo = async (
//   file: File,
//   convertToM3u8: boolean,
//   onProgress?: (progress: number) => void
// ) => {
//   const identifier = crypto.randomUUID();
//   const chunks = splitFile(file);
//   try {
//     await Promise.all(
//       chunks.map((chunk, index) =>
//         uploadChunk(chunk, index, chunks.length, identifier)
//       )
//     );

//     const response = await axios.post(`${server}/api/videos/merge-chunks`, {
//       identifier,
//       fileName: file.name,
//       convertToM3u8,
//     });

//     const videoUrl = `${server}${response.data.data.url}`;
//     onProgress && onProgress(100);
//     return videoUrl;
//   } catch (error) {
//     console.error("Upload failed:", error);
//     throw error;
//   }
// };

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const server = process.env.NEXT_PUBLIC_BASE_URL;

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

const uploadChunk = async (
  chunk: Blob,
  index: number,
  total: number,
  identifier: string
) => {
  const reader = new FileReader();
  reader.readAsDataURL(chunk);

  await new Promise((resolve) => (reader.onload = resolve));

  return axios.post(`${server}/api/videos/upload-chunk`, {
    chunk: (reader.result as string).split(",")[1],
    identifier,
    chunkIndex: index,
    totalChunks: total,
  });
};

export const uploadVideo = async (
  file: File,
  convertToM3u8: boolean,
  setPlaybackUrl: (url: string) => void,
  onProgress?: (progress: number) => void
) => {
  // const identifier = crypto.randomUUID();
  const identifier = uuidv4();
  const chunks = splitFile(file);
  const totalChunks = chunks.length;
  let uploadedChunks = 0;

  try {
    for (const [index, chunk] of chunks.entries()) {
      await uploadChunk(chunk, index, totalChunks, identifier);
      uploadedChunks++;
      onProgress &&
        onProgress(Math.round((uploadedChunks / totalChunks) * 100));
    }

    const response = await axios.post(`${server}/api/videos/merge-chunks`, {
      identifier,
      fileName: file.name,
      convertToM3u8,
    });

    const videoUrl = `${response.data.data.url}`;
    setPlaybackUrl(videoUrl);
    onProgress && onProgress(100);
    return videoUrl;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};
