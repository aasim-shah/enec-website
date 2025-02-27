"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Switch } from "@/components/ui/switch";
import { use, useEffect } from "react";
import useApi from "@/hooks/useApi";
import { addLanuage } from "@/lib/services";
import { toast } from "sonner";

const formSchema = z.object({
  title: z.string().min(1, "Language name is required"),
  key: z.string().min(2, "Language key must be at least 2 characters").max(5),
  isDefault: z.boolean().default(false),
  isRtl: z.boolean().default(false),
});

export function AddLanguageDialog({
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
      key: "",
      isDefault: false,
      isRtl: false,
    },
  });

  const { data, error, loading, execute } = useApi(addLanuage);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      execute(values);
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create language:", error);
    }
  }

  useEffect(() => {
    if (data) {
      console.log("show toast");
      toast.success("Language created successfully");
      setRefresh((prev: boolean) => !prev);
    }
    if (error) {
      toast.error(`Failed to create language: ${error}`);
    }
  }, [data, error]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Language</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Name</FormLabel>
                  <FormControl>
                    <Input placeholder="English" {...field} />
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
                  <FormLabel>Language Key</FormLabel>
                  <FormControl>
                    <Input placeholder="en" {...field} />
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
                    <FormDescription>
                      Set as the default language
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
            />
            <FormField
              control={form.control}
              name="isRtl"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">RTL Support</FormLabel>
                    <FormDescription>
                      Enable right-to-left text direction
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
            />
            <DialogFooter>
              <Button type="submit">Add Language</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
