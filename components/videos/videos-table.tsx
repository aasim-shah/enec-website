// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export const VideosTable = () => {
//   const videos = [
//     {
//       id: "1",
//       title: "Video 1",
//       description: "This is the first video.",
//       createdAt: "2021-08-01",
//     },
//     {
//       id: "2",
//       title: "Video 2",
//       description: "This is the second video.",
//       createdAt: "2021-08-02",
//     },
//     {
//       id: "3",
//       title: "Video 3",
//       description: "This is the third video.",
//       createdAt: "2021-08-03",
//     },
//   ];
//   return (
//     <Table>
//       <TableCaption>A list of your videos.</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Title</TableHead>
//           <TableHead>Description</TableHead>
//           <TableHead>Created At</TableHead>
//           <TableHead className="text-right">Actions</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {videos.map((video: any) => (
//           <TableRow key={video.id}>
//             <TableCell>{video.title}</TableCell>
//             <TableCell className="truncate max-w-[300px]">
//               {video.description}
//             </TableCell>
//             <TableCell>
//               {new Date(video.createdAt).toLocaleDateString()}
//             </TableCell>
//             <TableCell className="text-right">
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="h-8 w-8 p-0">
//                     <span className="sr-only">Open menu</span>
//                     <MoreHorizontal className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                   <DropdownMenuItem
//                     onClick={() => navigator.clipboard.writeText(video.id)}
//                   >
//                     Copy Video ID
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>Edit Video</DropdownMenuItem>
//                   <DropdownMenuItem className="text-destructive">
//                     Delete Video
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   );
// };

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useApi from "@/hooks/useApi";
import { deleteVideo, fetchAllLanguages, fetchAllVideos } from "@/lib/services";
import { useEffect, useState } from "react";
import Image from "next/image";
import { VideoPlayer } from "../preview-video";
import axios from "axios";
import { Language } from "../languages/languages-table";
// import VideoPlayer from "../video-player";
// import SimpleVideoPlayer from "../video-player";

const serverURL = process.env.NEXT_PUBLIC_BASE_URL;

export interface Video {
  _id: string;
  title: string;
  description: string;
  language: string;
  thumbnail: string;
  tags: string[];
  url: string;
}

type Props = {
  refresh: boolean;
  setRefresh: (open: boolean | ((prev: boolean) => boolean)) => void;
  selectVideo: (video: Video) => void;
  showUpdateDialog: (open: boolean | ((prev: boolean) => boolean)) => void;
};

export const VideosGrid = ({
  refresh,
  setRefresh,
  selectVideo,
  showUpdateDialog,
}: Props) => {
  const { data, error, loading, execute } = useApi(fetchAllVideos);
  const [videos, setVideos] = useState<Video[]>([]);
  const [previewVideo, setPreviewVideo] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const {
    data: lanuagesList,
    error: langFetchError,
    execute: fetchLangs,
  } = useApi(fetchAllLanguages);
  const [languages, setLanguages] = useState<Language[]>([]);

  const { data: deleteVideResp, execute: deleteVideoExecute } =
    useApi(deleteVideo);

  useEffect(() => {
    execute(selectedLanguage);
  }, [execute, deleteVideoExecute, refresh, selectedLanguage]);

  useEffect(() => {
    if (data && data.data) {
      setVideos(data.data);
    }
  }, [data, deleteVideResp, refresh]);

  const handlePlayVideo = (url: string) => {
    const playVideo = `${serverURL}${url}`;
    setPreviewVideo(playVideo);
  };

  const handleDeleteVideo = async (id: string) => {
    deleteVideoExecute(id);
    setRefresh((prev: boolean) => !prev);
  };

  useEffect(() => {
    fetchLangs();
  }, []);

  useEffect(() => {
    if (lanuagesList) {
      setLanguages(lanuagesList.data);
    }
    if (langFetchError) {
      console.error("Failed to fetch languages", langFetchError);
    }
  }, [lanuagesList, langFetchError]);

  return (
    <>
      <div className="flex justify-end mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              {selectedLanguage || "Language"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Select Language</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setSelectedLanguage(null)}>
              All
            </DropdownMenuItem>
            {languages.map((lang) => (
              <DropdownMenuItem
                key={lang._id}
                onClick={() => setSelectedLanguage(lang.key)}
              >
                {lang.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos &&
          videos.length > 0 &&
          videos.map((video) => (
            <Card key={video._id} className="overflow-hidden  border p-3">
              <div className="h-52 rounded-tl-2xl rounded-tr-2xl overflow-hidden">
                <Image
                  src={`${serverURL}/${video.thumbnail}`}
                  alt={video.title}
                  className="w-full h-full "
                  // layout="responsive"
                  width={300}
                  height={300}
                />
              </div>

              <CardContent>
                <CardTitle className="text-sm mt-4">{video.title}</CardTitle>
                <p className="truncate text-sm my-2 text-gray-600">
                  {video.description}
                </p>
                <Badge className="mt-2">{video.language}</Badge>
                <div className="flex justify-end mt-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handlePlayVideo(video.url)}
                      >
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          selectVideo(video);
                          showUpdateDialog(true);
                        }}
                      >
                        Edit Video
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          handleDeleteVideo(video._id);
                        }}
                        className="text-destructive"
                      >
                        Delete Video
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {previewVideo && (
        <div className="">
          <VideoPlayer
            hlsUrl={previewVideo}
            onClose={() => {
              setPreviewVideo("");
            }}
          />
        </div>
      )}
    </>
  );
};
