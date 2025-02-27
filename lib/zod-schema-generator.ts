import { z } from "zod";

export const generateZodSchema = (fields: any[]) => {
  const schemaShape: Record<string, any> = {};

  fields.forEach((field) => {
    let fieldSchema;

    switch (field.type) {
      case "text":
      case "password":
        fieldSchema = z
          .string({
            required_error: `${field.title} is required`,
          })
          .trim();
        if (field.required)
          fieldSchema = fieldSchema.min(1, `${field.title} is required`);
        break;

      case "email":
        fieldSchema = z
          .string({
            required_error: `${field.title} is required`,
          })
          .email(`${field.title} must be a valid email`);
        if (field.required)
          fieldSchema = fieldSchema.min(1, `${field.title} is required`);
        break;

      case "number":
        fieldSchema = z.preprocess(
          (val) => (val ? Number(val) : undefined),
          z.number().optional()
        );
        if (field.required)
          fieldSchema = fieldSchema.refine(
            (val) => val !== undefined,
            `${field.title} is required`
          );
        break;

      case "select":
        if (field.options && field.options.length > 0) {
          fieldSchema = z.enum([...field.options] as [string, ...string[]], {
            required_error: `${field.title} is required`,
          });
        } else {
          fieldSchema = z.string().min(1, `${field.title} is required`);
        }

        if (!field.required) fieldSchema = fieldSchema.optional();
        break;

      case "checkbox":
        if (field.options) {
          fieldSchema = z.array(z.string()).optional(); // Multi-checkbox array
        } else {
          fieldSchema = z.boolean(); // Single checkbox
          if (field.required)
            fieldSchema = fieldSchema.refine(
              (val) => val === true,
              `${field.title} must be checked`
            );
        }
        break;

      case "file":
        fieldSchema = z.any().optional(); // Adjust based on file handling needs
        if (field.required)
          fieldSchema = fieldSchema.refine(
            (val) => !!val,
            `${field.title} is required`
          );
        break;

      default:
        fieldSchema = z.string().optional();
    }

    schemaShape[field.title] = fieldSchema;
  });

  return z.object(schemaShape);
};
