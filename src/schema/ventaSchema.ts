import { z } from "zod";

export const ventaSchema = z.object({
    fecha: z
        .string({message: "La Fecha debe ser obligatoria"})
        .min(3, "La fecha debe tener almenos 3 caracteres")
        .trim()
        .min(1),
    total: z
        .coerce
        .number({message: "El total debe ser obligatorio"})
        .positive(),
    id_cliente: z
        .coerce
        .number({message: "El id_cliente debe ser obligatorio"})
        .positive("el telefono debe ser un valor positivo"),
});

export const updateVentaSchema = ventaSchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
        message: "Debe proporcionar al menos un campo para actualizar"});