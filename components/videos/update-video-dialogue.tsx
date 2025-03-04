"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { uploadVideo } from "@/lib/uploadVideo";
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
import useApi from "@/hooks/useApi";
import { fetchAllLanguages, updateVideo } from "@/lib/services";
import { Language } from "../languages/languages-table";
import { toast } from "sonner";
import FormFileDropzone from "../FormFileDropzone";

const formSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.union([z.instanceof(File), z.string()]).optional(),
  video: z.instanceof(File).optional(),
  language: z.string().min(1, "Language is required"),
  videoUrl: z.string().optional(),
});

export function UpdateVideoDialog({
  open,
  onOpenChange,
  videoData,
  setRefresh,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoData: {
    _id: string;
    title: string;
    description: string;
    language: string;
    thumbnail?: string;
  } | null;
  setRefresh: (open: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      thumbnail: undefined,
      language: "",
    },
  });

  const [languages, setLanguages] = useState<Language[]>([]);
  const { data: languagesList, execute: fetchLangs } =
    useApi(fetchAllLanguages);
  const { execute: updateVideoApi, loading } = useApi(updateVideo);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchLangs();
  }, []);

  useEffect(() => {
    if (languagesList) {
      setLanguages(languagesList.data);
    }
  }, [languagesList]);

  useEffect(() => {
    if (videoData) {
      form.reset({
        id: videoData._id,
        title: videoData.title,
        description: videoData.description,
        language: videoData.language,
        thumbnail: videoData.thumbnail,
      });
    }
  }, [videoData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsUploading(true);
      console.log("Submitting values:", values);

      const formData = new FormData();
      formData.append("id", values.id);
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("language", values.language);

      if (values.thumbnail) {
        formData.append("thumbnail", values.thumbnail);
      }

      console.log("Final update payload:", formData);
      const response = await updateVideoApi(formData);

      if (response.error) {
        throw new Error(response.error);
      }

      toast.success("Video updated successfully");
      setRefresh((prev) => !prev);
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update video");
      console.error("Update failed", error);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Update Video</DialogTitle>
          <DialogDescription>
            Modify the video details and save changes.
          </DialogDescription>
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
                        {languages.map((lang: Language) => (
                          <SelectItem key={lang._id} value={lang.key}>
                            {lang.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormFileDropzone
              label="Thumbnail"
              name="thumbnail"
              multiple={false}
              control={form.control}
            />

            {isUploading && <p className="text-sm">Uploading: {progress}%</p>}
            <DialogFooter>
              <Button type="submit" disabled={isUploading || loading}>
                {isUploading ? "Uploading..." : "Update Video"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
