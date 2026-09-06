import type { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validarProducto = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            req.body = schema.parse(req.body);
            next();
        }catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({error: error.issues})
                return;
            }
            res.status(500).json({error: "Error interno del servidor"});
        }
    };
}
/*
export const validarProducto = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const resultado = schema.safeParse(req.body);
        if (!resultado.success) {
            res.status(400).json({error:"Invalido", detalles: resultado.error.flatten().fieldErrors});
            return;
        }
        req.body = resultado.data;
        next();
    }
}
*/