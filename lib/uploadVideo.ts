// export async function uploadVideo(
//   file: File,
//   onProgress?: (progress: number) => void
// ) {
//   const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
//   const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
//   const filename = `${Date.now()}_${file.name}`;

//   for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
//     const start = chunkIndex * CHUNK_SIZE;
//     const end = Math.min(start + CHUNK_SIZE, file.size);
//     const chunk = file.slice(start, end);

//     const formData = new FormData();
//     formData.append("chunk", chunk);

//     const headers = new Headers({
//       filename: filename,
//       chunkIndex: chunkIndex.toString(),
//       totalChunks: totalChunks.toString(),
//     });

//     const response = await fetch("/api/upload-chunk", {
//       method: "POST",
//       body: formData,
//       headers,
//     });

//     if (!response.ok) throw new Error(`Chunk ${chunkIndex} failed to upload`);

//     if (onProgress) {
//       onProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100));
//     }
//   }

//   const finalizeResponse = await fetch("/api/finalize-upload", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ filename }),
//   });

//   if (!finalizeResponse.ok) throw new Error("Failed to finalize upload");

//   return filename;
// }

import axios from "axios";

export async function uploadVideo(
  file: File,
  otherData: any,
  onProgress?: (progress: number) => void
) {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const filename = `${Date.now()}_${file.name}`;

  for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
    const start = chunkIndex * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    const formData = new FormData();
    formData.append("chunk", chunk);

    await axios.post(
      "http://localhost:5000/api/videos/upload-chunk",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure proper format
          filename,
          chunkIndex: chunkIndex.toString(),
          totalChunks: totalChunks.toString(),
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = Math.round(((chunkIndex + 1) / totalChunks) * 100);
            onProgress(progress);
          }
        },
      }
    );
  }

  console.log({ otherData });

  const finalData = new FormData();
  finalData.append("filename", filename);
  finalData.append("title", otherData.title);
  finalData.append("description", otherData.description);
  finalData.append("language", otherData.language);
  finalData.append("thumbnail", otherData.thumbnail);

  const { data } = await axios.post(
    "http://localhost:5000/api/videos/finalize-upload",
    finalData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // Correct placement
      },
    }
  );

  console.log({ reseon: data });

  return data.filename;
}
