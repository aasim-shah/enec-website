"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
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
import axios from "axios";
import { generateZodSchema } from "@/lib/zod-schema-generator";
import { useEffect, useState } from "react";
import FormFileDropzone from "@/components/form-dropzone";
import Link from "next/link";

export default function DynamicForm() {
  const [fields, setFields] = useState<
    { title: string; type: string; options?: string[]; required: boolean }[]
  >([]);

  const serverURL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    async function fetchFields() {
      const response = await axios.get(`${serverURL}/api/videos/form/`);
      const feilds = response.data.data[1].fields;
      setFields(feilds);
    }
    fetchFields();
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }, // Get validation errors
  } = useForm({
    resolver: zodResolver(generateZodSchema(fields)),
  });

  function onSubmit(data: any) {
    console.log("Form Data:", data);
  }

  return (
    <div className="  p-10 w-11/12 mx-auto max-w-[700px] border rounded-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => (
          <div key={field.title} className="flex flex-col gap-2">
            <label className="text-sm font-medium">{field.title}</label>

            {field.type === "select" ? (
              <Controller
                name={field.title}
                control={control}
                render={({ field: selectField }) => (
                  <>
                    <Select
                      onValueChange={selectField.onChange}
                      defaultValue={selectField.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.title}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors[field.title] && (
                      <p className="text-red-500 text-xs">
                        {errors[field.title]?.message as string}
                      </p>
                    )}
                  </>
                )}
              />
            ) : field.type === "checkbox" ? (
              <Controller
                name={field.title}
                control={control}
                defaultValue={field.options ? [] : false}
                render={({ field: { value, onChange } }) => (
                  <div className="flex flex-row gap-5 flex-wrap">
                    {field.options ? (
                      field.options.map((option) => {
                        const isChecked = value.includes(option);
                        const optionId = `${field.title}-${option.replace(
                          /\s+/g,
                          "-"
                        )}`;
                        return (
                          <div key={option} className="flex items-center gap-2">
                            <label
                              htmlFor={optionId}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <Checkbox
                                id={optionId}
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...value, option]
                                    : value.filter((v: string) => v !== option);
                                  onChange(newValue);
                                }}
                              />
                              <span>{option}</span>
                            </label>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex items-center gap-2">
                        <label
                          htmlFor={field.title}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Checkbox
                            id={field.title}
                            checked={value}
                            onCheckedChange={onChange}
                          />
                          <span>{field.title}</span>
                        </label>
                      </div>
                    )}
                    {errors[field.title] && (
                      <p className="text-red-500 text-xs">
                        {errors[field.title]?.message as string}
                      </p>
                    )}
                  </div>
                )}
              />
            ) : field.type === "file" ? (
              <FormFileDropzone
                name={field.title}
                control={control}
                label={""}
                multiple={false}
              />
            ) : (
              <Controller
                name={field.title}
                control={control}
                render={({ field: inputField }) => (
                  <>
                    <Input
                      type={field.type}
                      {...inputField}
                      placeholder={`Enter ${field.title}`}
                    />
                    {errors[field.title] && (
                      <p className="text-red-500 text-xs">
                        {errors[field.title]?.message as string}
                      </p>
                    )}
                  </>
                )}
              />
            )}
          </div>
        ))}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </div>
  );
}
