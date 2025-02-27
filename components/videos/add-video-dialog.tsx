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
import { fetchAllLanguages } from "@/lib/services";
import { Language } from "../languages/languages-table";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnail: z.instanceof(File).optional(),
  video: z.instanceof(File, { message: "Video is required" }),
  language: z.string().min(1, "Language is required"),
});

export function AddVideoDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      language: "",
      thumbnail: undefined,
      video: undefined,
    },
  });

  const [languages, setLanguages] = useState<Language[]>([]);

  const { data: lanuagesList, execute: fetchLangs } = useApi(fetchAllLanguages);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values.video) return;

    setIsUploading(true);
    try {
      const otherData = values;
      // otherData.append("thumbnail", values.thumbnail as File);

      const filename = await uploadVideo(values.video, otherData, setProgress);
      // alert(`Upload successful: ${filename}`);
      // onOpenChange(false);
      // form.reset();
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
      setProgress(0);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Upload New Video</DialogTitle>
          <DialogDescription>
            Fill in the details and upload a video.
          </DialogDescription>
        </DialogHeader>
        {/* <Form {...form}>
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
                      accept="*"
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
            {isUploading && <p className="text-sm">Uploading: {progress}%</p>}
            <DialogFooter>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Video"}
              </Button>
            </DialogFooter>
          </form>
        </Form> */}
      </DialogContent>
    </Dialog>
  );
}
