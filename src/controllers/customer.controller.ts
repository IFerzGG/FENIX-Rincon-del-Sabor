import type { Request, Response } from "express";
import {ModelCustomer} from "../models/customer.model.js";

export const getCustomers = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Customers']
    #swagger.summary = 'Obtener el menú de clientes'
    #swagger.description = 'Obtener el menú de clientes sin excepción de categoría. Devuelve un array de objetos con los clientes disponibles en la base de datos.'
    */
    try {
        const customers = await ModelCustomer.getAllCustomers();
        res.json(customers);
    } catch (error) {
        console.error("Error al consultar el menú:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCustomersId = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Customers']
    #swagger.summary = 'Obtener un cliente por ID'
    #swagger.description = 'Obtener un cliente específico por su ID.'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "El id debe ser numerico" });
            return;
        }
        const customer = await ModelCustomer.getCustomerById(id);
        if (!customer) {
            res.status(404).json({ message: "Cliente no encontrado" });
            return;
        }
        res.json(customer);
    } catch (error) {
        console.error("Error al consultar el cliente:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const postCustomer = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Customers']
    #swagger.summary = 'Crear un nuevo cliente'
    #swagger.description = 'Crear un nuevo cliente en la base de datos.'
    */
    try {
        const{ nombre, email, telefono } = req.body;
        if (!nombre || !email || telefono === undefined || telefono === null) {
            res.status(400).json({ message: "Faltan campos requeridos" });
            return;
        }
        const customer = await ModelCustomer.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        console.error("Error al crear el cliente:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const putCustomer = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Customers']
    #swagger.summary = 'Actualizar un cliente'
    #swagger.description = 'Actualizar un cliente existente en la base de datos.'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "El id debe ser numerico" });
            return;
        }
        const customer = await ModelCustomer.updateCustomer(id, req.body);
        if (!customer) {
            res.status(404).json({ message: "Cliente no encontrado" });
            return;
        }
        res.json(customer);
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteCustomer = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Customers']
    #swagger.summary = 'Eliminar un cliente'
    #swagger.description = 'Eliminar un cliente existente en la base de datos.'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "El id debe ser numerico" });
            return;
        }
        const customerEliminado = await ModelCustomer.deleteCustomer(id);
        if (!customerEliminado) {
            res.status(404).json({ message: "Cliente no encontrado" });
            return;
        }
        res.status(200).json({ message: "Cliente eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};