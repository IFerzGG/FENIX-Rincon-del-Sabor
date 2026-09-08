import { pool } from '../config/db.js';
import type { ProductQueryParams } from "../schema/product.schema.js";

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
        const result = await pool.query("SELECT * FROM productos WHERE id_productos = $1;", [id]);
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
                WHERE id_productos = $${campos.length + 1} 
                RETURNING *;`, [...valores, id]);
        return result.rows[0] || null;
    },
    deleteProduct: async (id: number): Promise<boolean> => {
        const result = await pool.query("DELETE FROM productos WHERE id_productos = $1;", [id]);
        return (result.rowCount ?? 0) > 0 ;
    },
    getFindFilter: async (filtro: ProductQueryParams) => {
    const condiciones: string[] = [];
    const parametros: any[] = [];
    let index = 1;

    //la construccion de las condiciones
    if (filtro.nombre !== undefined) {
      condiciones.push(`nombre ILIKE $${index}`);
      parametros.push(filtro.nombre);
      index++;
    }

    if (filtro.stock !== undefined) {
      condiciones.push(`stock = $${index}`);
      parametros.push(filtro.stock);
      index++;
    }

    if (filtro.minPrice !== undefined) {
      condiciones.push(`precio >= $${index}`);
      parametros.push(filtro.minPrice);
      index++;
    }
    if (filtro.maxPrice !== undefined) {
      condiciones.push(`precio <= $${index}`);
      parametros.push(filtro.maxPrice);
      index++;
    }
    //Construimos WHERE con ADD
    const where = condiciones.length > 0 
      ? `WHERE ${condiciones.join(` AND `)}` 
      : "";
    //Conteo Total de productos que coinciden con los filtros
    const countQuery = `SELECT COUNT(*) FROM productos ${where}`;
    const countResult = await pool.query(countQuery, parametros);
    const total = Number(countResult.rows[0].count);
    //Paginacion-Siempre al final, usando el indice actual
    const page = filtro.page ?? 1;
    const limit = filtro.limit ?? 10;
    const offset = (page - 1) * limit;
    parametros.push(limit);
    parametros.push(offset);
    //Agregamos LIMIT y OFFSET para mandar a SQL
    const sql = ` SELECT * FROM productos ${where} ORDER BY id_productos ASC
      LIMIT $${index} 
      OFFSET $${index + 1}`;
    const { rows } = await pool.query(sql, parametros);

    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },
  findByName: async (name:string) => {
    const {rows} = await pool.query("SELECT * FROM productos WHERE LOWER(nombre) = LOWER($1);", [name]);
    return rows[0];
  }
};