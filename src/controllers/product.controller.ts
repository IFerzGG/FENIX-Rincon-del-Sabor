import type { Request, Response } from "express";
import { ModelProduct } from "../models/product.model.js";
import { productQueryParams } from "../schema/product.schema.js";
import { productService } from "../services/productServices.js";

export const getMenu = async (req: Request, res: Response) => {
    /*#swagger.tags = ['Products']
    #swagger.summary = 'Obtener el menú de productos'
    #swagger.description = 'Obtener el menú de productos sin excepción de categoría. Devuelve un array de objetos con los productos disponibles en la base de datos.'
    */
    try {
        const resultQuery = productQueryParams.safeParse(req.query);
        console.log(resultQuery);
        if (!resultQuery.success) {
            return res.status(400).json({ error: resultQuery.error.issues});
        }
        const result = await productService.getProductsFilters(resultQuery.data);
        res.json(result);
    }   catch (error) {
        console.error("Error al consultar el menú:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProduct = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Products']
    #swagger.summary = 'Obtener un producto por ID'
    #swagger.description = 'Obtener un producto específico por su ID.'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "El id debe ser numerico" });
            return;
        }
        const product = await ModelProduct.getProductById(id);
        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        res.json(product);
    } catch (error) {
        console.error("Error al consultar el producto:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const postProduct = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Products']
    #swagger.summary = 'Crear un nuevo producto'
    #swagger.description = 'Crear un nuevo producto en la base de datos.'
    */
    try {
        const{ nombre, descripcion, precio, stock } = req.body;
        if (!nombre || !precio || !descripcion || stock === undefined || stock === null) {
            res.status(400).json({ message: "Faltan campos requeridos" });
            return;
        }
        const product = await ModelProduct.createProduct(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error("Error al crear el producto:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const putProduct = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Products']
    #swagger.summary = 'Actualizar un producto'
    #swagger.description = 'Actualizar un producto existente en la base de datos.'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "El id debe ser numerico" });
            return;
        }
        const product = await ModelProduct.updateProduct(id, req.body);
        if (!product) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        res.json(product);
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    /*#swagger.tags = ['Products']
    #swagger.summary = 'Eliminar un producto'
    #swagger.description = 'Eliminar un producto existente en la base de datos.'
    */
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: "El id debe ser numerico" });
            return;
        }
        const productEliminado = await ModelProduct.deleteProduct(id);
        if (!productEliminado) {
            res.status(404).json({ message: "Producto no encontrado" });
            return;
        }
        res.status(200).json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};