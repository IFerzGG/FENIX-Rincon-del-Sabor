import { z } from "zod";

export const customerSchema = z.object({
    nombre: z
    .string({message: "El nombre debe ser obligatorio"})
    .min(3, "el nombre debe tener almenos 3 caracteres")
    .trim()
    .min(1),
    email: z
    .string({message: "El email debe ser obligatorio"})
    .max(255, {message: "El email no debe exceder los 255 caracteres"})
    .trim()
    .min(1),
    telefono: z
    .number({message: "El telefono debe ser obligatorio"})
    .positive("el telefono debe ser un valor positivo")
    .optional(),
});

export const updateCustomerSchema = customerSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe proporcionar al menos un campo para actualizar"});

export const customerQueryParams = z.object({
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
});

export type CustomerQueryParams = z.infer<typeof customerQueryParams>;
export type CustomerSchema = z.infer<typeof customerSchema>;