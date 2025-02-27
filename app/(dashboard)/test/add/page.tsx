"use client";
import { useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

const fieldTypes = [
  "text",
  "number",
  "email",
  "password",
  "select",
  "checkbox",
  "radio",
  "file",
  "date",
] as const;

const fieldSchema = z.object({
  title: z.string().min(1, "Field title is required"),
  type: z.enum(fieldTypes),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
});

const categorySchema = z.object({
  title: z.string().min(1, "Form title is required"),
  fields: z.array(fieldSchema),
});

export default function AddCategory() {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: { title: "", fields: [] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "fields" });

  async function onSubmit(data: any) {
    console.log({ data });
  }

  return (
    <div className="p-10 w-11/12 mx-auto max-w-[700px] border rounded-2xl space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Add Field Button at the Top */}
        <div className="flex w-full justify-end">
          <Button
            type="button"
            className="w-32 "
            onClick={() =>
              append(
                { title: "", type: "text", required: false },
                { shouldFocus: false }
              )
            }
          >
            + Add Field
          </Button>
        </div>

        <Input placeholder="Form Title" {...register("title")} />
        {errors.title && (
          <p className="text-red-500 text-xs">{errors.title.message}</p>
        )}

        {/* Render Fields in Reverse Order (New Fields Appear on Top) */}
        {[...fields].reverse().map((field, reversedIndex) => {
          const index = fields.length - 1 - reversedIndex; // Map to the correct index in original array
          return (
            <Card key={field.id} className="py-5 px-3">
              <CardContent className="space-y-3 w-full p-0">
                <div className="grid grid-cols-12 gap-2 w-full">
                  <div className="col-span-9">
                    <Input
                      placeholder="Field Name"
                      {...register(`fields.${index}.title`)}
                    />
                    {errors.fields?.[index]?.title && (
                      <p className="text-red-500 text-xs">
                        {errors.fields?.[index]?.title?.message ?? ""}
                      </p>
                    )}
                  </div>
                  <div className="col-span-3">
                    <Controller
                      control={control}
                      name={`fields.${index}.type`}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Field Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>

                {["select", "checkbox", "radio"].includes(
                  watch(`fields.${index}.type`) || ""
                ) && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label>Options</label>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          setValue(`fields.${index}.options`, [
                            ...(watch(`fields.${index}.options`) || []),
                            "",
                          ])
                        }
                      >
                        Add Option
                      </Button>
                    </div>
                    {watch(`fields.${index}.options`)?.map((_, optionIndex) => (
                      <div key={optionIndex} className="flex gap-2">
                        <Input
                          {...register(
                            `fields.${index}.options.${optionIndex}`
                          )}
                          placeholder={`Option ${optionIndex + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setValue(
                              `fields.${index}.options`,
                              watch(`fields.${index}.options`)?.filter(
                                (_, i) => i !== optionIndex
                              )
                            );
                          }}
                        >
                          <FaTrash size={18} color="red" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center w-full">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Controller
                      control={control}
                      name={`fields.${index}.required`}
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      )}
                    />
                    <span>Required</span>
                  </label>

                  <Button
                    type="button"
                    variant="outline"
                    className="text-red-500"
                    onClick={() => remove(index)}
                  >
                    Remove Field
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
