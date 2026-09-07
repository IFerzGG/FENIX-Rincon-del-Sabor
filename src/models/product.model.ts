import { pool } from '../config/db.js';

export interface Product {
    id: number;
    nombre: string;
    precio: number;
    descripcion: string;
    stock: number;
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
        const { nombre, precio, descripcion, stock } = product;
        const query = "INSERT INTO productos (nombre, precio, descripcion, stock) VALUES ($1, $2, $3, $4) RETURNING *;";
        const values = [nombre, precio, descripcion, stock];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    updateProduct: async (id: number, product: ActualizarProductoInput): Promise<Product | null> => {
        const campos = Object.keys(product) as (keyof ActualizarProductoInput)[];
        const setClause = campos
            .map((campo, index) => `${campo} = $${index + 1}`)
            .join(", ");
        const valores = campos.map((campo) => product[campo]);
        const result = await pool.query(
            `UPDATE productos 
                SET ${setClause} 
                WHERE id = $${campos.length + 1} 
                RETURNING *;`, [...valores, id]);
        return result.rows[0] || null;
    },
    deleteProduct: async (id: number): Promise<boolean> => {
        const result = await pool.query("DELETE FROM productos WHERE id = $1;", [id]);
        return (result.rowCount ?? 0) > 0 ;
    }
};