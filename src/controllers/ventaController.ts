import type { Request, Response } from "express";
import {ModelVentas} from "../models/ventaModel.js";
import { ventaSchema } from "../schema/ventaSchema.js";

export const getVenta = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Ventas']
    #swagger.summary = 'Obtener Todas Las Ventas'
    #swagger.description = 'Obtener las ventas de los clientes sin excepción de categoría. Devuelve un array de objetos con los clientes disponibles en la base de datos.'
    */
    try {
        const ventas = await ModelVentas.getAllVenta();
        res.json(ventas);
    } catch (error) {
        console.error("Error al consultar las ventas:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getVentaId = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Ventas']
    #swagger.summary = 'Obtener una Venta por ID'
    #swagger.description = 'Obtener una venta específico por su ID.'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "El id debe ser numerico" });
            return;
        }
        const ventas = await ModelVentas.getVentaById(id);
        if (!ventas) {
            res.status(404).json({ message: "Venta no encontrado" });
            return;
        }
        res.json(ventas);
    } catch (error) {
        console.error("Error al consultar la venta:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const postVenta = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Ventas']
    #swagger.summary = 'Crear una nueva Ventas'
    #swagger.description = 'Crear una nueva Venta en la base de datos.'
    */
    try {
        const validar = ventaSchema.safeParse(req.body);
        if(!validar.success){
            res.status(400).json({error: validar.error.issues});
            return;
        }
        const ventas = await ModelVentas.createVenta(validar.data);
        res.status(201).json(ventas);
    } catch (error) {
        console.error("Error al crear la venta:", error);
        res.status(500).json({ messazge: "Internal Server Error" });
    }
};

export const putVenta = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Ventas']
    #swagger.summary = 'Actualizar una Venta'
    #swagger.description = 'Actualizar una Venta ya existente en la base de datos.'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "El id debe ser numerico" });
            return;
        }
        const ventas = await ModelVentas.updateVenta(id, req.body);
        if (!ventas) {
            res.status(404).json({ message: "Venta no encontrado" });
            return;
        }
        res.json(ventas);
    } catch (error) {
        console.error("Error al actualizar la venta:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteVenta = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Ventas']
    #swagger.summary = 'Eliminar una Venta'
    #swagger.description = 'Eliminar una Venta existente en la base de datos.'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "El id debe ser numerico" });
            return;
        }
        const ventaEliminada = await ModelVentas.deleteVenta(id);
        if (!ventaEliminada) {
            res.status(404).json({ message: "Cliente no encontrado" });
            return;
        }
        res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};