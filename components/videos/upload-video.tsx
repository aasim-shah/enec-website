"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
// import { uploadVideo } from "@/lib/uploadVideo";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadVideo } from "@/lib/videoUploader";
import axios from "axios";
import useApi from "@/hooks/useApi";
import { fetchAllLanguages } from "@/lib/services";
import { Language } from "../languages/languages-table";
import { Switch } from "../ui/switch";
import { UploadProgressBar } from "../progress-bar";
import { toast } from "sonner";

const serverURL = process.env.NEXT_PUBLIC_BASE_URL;

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.instanceof(File).optional(),
  video: z.instanceof(File, { message: "Video is required" }),
  language: z.string().min(1, "Language is required"),
  convertToM3u8: z.boolean().default(false),
});

export function AddVideoDialog({
  open,
  onOpenChange,
  setRefresh,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setRefresh: (open: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      language: "",
      convertToM3u8: false,
      thumbnail: undefined,
      video: undefined,
    },
  });

  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [convertToM3u8, setConvertToM3u8] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState("");
  const { data: lanuagesList, execute: fetchLangs } = useApi(fetchAllLanguages);

  const [languages, setLanguages] = useState<Language[]>([]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.video) return;

    setIsUploading(true);
    try {
      try {
        const url = await uploadVideo(
          values.video as File,
          values.convertToM3u8,
          setPlaybackUrl,
          setProgress
        );
        const fonfirmUplaod = new FormData();
        fonfirmUplaod.append("title", values.title);
        fonfirmUplaod.append("description", values.description);
        fonfirmUplaod.append("language", values.language);
        fonfirmUplaod.append("thumbnail", values.thumbnail as File);
        fonfirmUplaod.append("videoUrl", url);
        const finalizeUpload = await axios.post(
          `${serverURL}/api/videos/finalize-upload`,
          fonfirmUplaod
        );

        if (finalizeUpload.status === 200) {
          setIsUploading(false);
          setProgress(0);
          onOpenChange(false);
          form.reset();
          setRefresh((prev: boolean) => !prev);
          console.log({ finalizeUpload });
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          setIsUploading(false);
          setProgress(0);
          console.log({ error });
          toast.error(
            `Upload failed  :   ${error.response.data.errors[0].message}`
          );
        } else {
          toast.error("Upload failed 3");
        }
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  }
  useEffect(() => {
    fetchLangs();
  }, []);

  useEffect(() => {
    if (lanuagesList) {
      setLanguages(lanuagesList.data);
    }
  }, [lanuagesList]);

  const VideoProcessingLoader = ({
    progress,
    open,
  }: {
    progress: number;
    open: boolean;
  }) => {
    if (progress !== 100 || !open) return null;

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-white text-sm font-semibold">
            processing video ...
          </p>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px] h-[90vh]  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <DialogHeader>
          <DialogTitle className="text-center">Upload New Video </DialogTitle>
          <VideoProcessingLoader progress={progress} open={open} />
          {/* <DialogDescription>
            Fill in the details and upload a video.
          </DialogDescription> */}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter video title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter video description"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((language: Language) => (
                          <SelectItem key={language._id} value={language.key}>
                            {language.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thumbnail"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      {...field}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="video"
              render={({ field: { value, ...field } }) => (
                <FormItem>
                  <FormLabel>Video</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="video/*"
                      {...field}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) field.onChange(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="convertToM3u8"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormDescription>
                      Convert video to m3u8 format
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            {/* {isUploading && <p className="text-sm">Uploading: {progress}%</p>} */}
            <DialogFooter className="flex justify-between  items-center ">
              {isUploading && <UploadProgressBar progress={progress} />}
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Video"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
