"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Switch } from "@/components/ui/switch";
import useApi from "@/hooks/useApi";
import { updateLanguage } from "@/lib/services";
import { toast } from "sonner";

// Define the schema with ID included
const formSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Language name is required"),
  key: z.string().min(2, "Language key must be at least 2 characters").max(5),
  isDefault: z.boolean().default(false),
  isRtl: z.boolean().default(false),
});

// Language interface
export interface Language {
  _id: string;
  title: string;
  key: string;
  isDefault: boolean;
  isRtl: boolean;
}

export function UpdateLanguageDialog({
  open,
  onOpenChange,
  language,
  setRefresh,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language | null;
  setRefresh: (open: boolean | ((prev: boolean) => boolean)) => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      title: "",
      key: "",
      isDefault: false,
      isRtl: false,
    },
  });

  useEffect(() => {
    if (language) {
      form.reset({
        id: language._id, // Map `_id` from API to `id`
        title: language.title,
        key: language.key,
        isDefault: language.isDefault,
        isRtl: language.isRtl,
      });
    }
  }, [language, form.reset]);

  const { data, error, execute } = useApi(updateLanguage);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting values:", values); // Debugging log
    try {
      await execute(values);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update language:", error);
    }
  }

  useEffect(() => {
    if (data) {
      toast.success("Language updated successfully");
      setRefresh((prev: boolean) => !prev);
    }
    if (error) {
      toast.error(`Failed to update language: ${error}`);
    }
  }, [data, error]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Language</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Default Language
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isRtl"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">RTL Support</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full">
                Update Language
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
