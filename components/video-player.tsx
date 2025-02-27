import React from "react";

export const VideoPlayer = () => {
  return (
    <div>
      <video controls>
        <source
          //   src="http://localhost:5000/uploads/videos/horses.mp4"
          //   src="http://localhost:5000/api/videos/stream/buyandgrab.mkv"
          src="http://localhost:5000/api/videos/stream/1740296771347_2024-07-29 14-38-10.mkv"
          type="video/mp4"
        />
      </video>
    </div>
  );
};
