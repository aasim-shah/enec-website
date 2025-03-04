"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Video, VideosGrid } from "@/components/videos/videos-table";
import { AddVideoDialog } from "@/components/videos/upload-video";
import { UpdateVideoDialog } from "@/components/videos/update-video-dialogue";

export default function PostsPage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [updateVideo, setUpdateVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Videos</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload New Video
        </Button>
      </div>
      <VideosGrid
        refresh={refresh}
        setRefresh={setRefresh}
        selectVideo={setSelectedVideo}
        showUpdateDialog={setUpdateVideo}
      />
      <AddVideoDialog
        setRefresh={setRefresh}
        open={open}
        onOpenChange={setOpen}
      />
      <UpdateVideoDialog
        open={Boolean(updateVideo)}
        onOpenChange={setUpdateVideo}
        videoData={selectedVideo}
        setRefresh={setRefresh}
      />
    </div>
  );
}
