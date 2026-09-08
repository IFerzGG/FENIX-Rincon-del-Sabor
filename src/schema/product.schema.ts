import { z } from "zod";

export const productSchema = z.object({
    nombre: z
    .string({message: "El nombre debe ser obligatorio"})
    .min(3, "el nombre debe tener almenos 3 caracteres")
    .trim()
    .min(1),
    descripcion: z
    .string({message: "La descripción debe ser obligatoria"})
    .min(3, "la descripción debe tener al menos 3 caracteres")
    .trim()
    .min(1),
    precio: z
    .number({message: "El precio debe ser obligatorio"})
    .positive("el precio debe ser mayor a 0"),
    stock: z
    .number({message: "El stock debe ser un valor numerico"})
    .refine(val => val >=0, {message: "El stock debe ser mayor o igual a 0"})
    .optional(),
});

export const updateProductSchema = productSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe proporcionar al menos un campo para actualizar"});

export const productQueryParams = z.object({
  page: z
    .coerce.number()
    .int()
    .positive()
    .default(1),
  limit: z
    .coerce.number()
    .int()
    .positive()
    .default(10),
  nombre: z
    .string()
    .trim()
    .optional(),
  stock: z
    .coerce.number()
    .int()
    .nonnegative()
    .optional(),
  minPrice: z
    .coerce.number()
    .optional(),
  maxPrice: z
    .coerce.number()
    .optional(),
});

export type ProductQueryParams = z.infer<typeof productQueryParams>;