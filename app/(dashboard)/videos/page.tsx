"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideosGrid } from "@/components/videos/videos-table";
import { AddVideoDialog } from "@/components/videos/upload-video";

export default function PostsPage() {
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Videos</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Upload New Video
        </Button>
      </div>
      <VideosGrid refresh={refresh} setRefresh={setRefresh} />
      <AddVideoDialog
        setRefresh={setRefresh}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
