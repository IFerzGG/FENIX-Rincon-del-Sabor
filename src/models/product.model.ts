import { pool } from '../config/db.js';

export interface Product {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
}

export type CrearProductoInput = Omit<Product, 'id'>;
export type ActualizarProductoInput = Partial<CrearProductoInput>;

export const ModelProduct = {
    getAllProducts: async (): Promise<Product[]> => {
        const result = await pool.query("SELECT * FROM productos;");
        console.log(result);
        return result.rows;
    },
    getProductById: async (id: number): Promise<Product | null> => {
        const result = await pool.query("SELECT * FROM productos WHERE id = $1;", [id]);
        return result.rows[0] || null;
    },
    createProduct: async (product: CrearProductoInput): Promise<Product> => {
        const { nombre, precio, categoria } = product;
        const query = "INSERT INTO productos (nombre, precio, categoria) VALUES ($1, $2, $3) RETURNING *;";
        const values = [nombre, precio, categoria];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    updateProduct: async (id: number, product: ActualizarProductoInput): Promise<Product | null> => {
        const { nombre, precio, categoria } = product;
        const query = "UPDATE productos SET nombre = $1, precio = $2, categoria = $3 WHERE id = $4 RETURNING *;";
        const values = [nombre, precio, categoria, id];
        const result = await pool.query(query, values);
        return result.rows[0] || null;
    },
    deleteProduct: async (id: number): Promise<boolean> => {
        const result = await pool.query("DELETE FROM productos WHERE id = $1;", [id]);
        return (result.rowCount ?? 0) > 0 ;
    }
};