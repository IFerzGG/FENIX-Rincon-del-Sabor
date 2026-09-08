import { pool } from '../config/db.js';

export interface Ventas {
    id: number;
    fecha: string;
    total: number;
    id_cliente: number;
}
export interface VentaConCliente extends Ventas {
  nombre_cliente: string;
}

export type CrearVentasInput = Omit<Ventas, 'id'>;
export type ActualizarVentasInput = Partial<CrearVentasInput>;

export const ModelVentas = {
    getAllVenta: async (): Promise<VentaConCliente[]> => {
        const query = `SELECT venta.id, venta.fecha, venta.total, venta.id_cliente,
            customers.nombre AS nombre_cliente
            FROM venta 
            INNER JOIN customers ON venta.id_cliente = customers.id
            ORDER BY venta.id ASC;`;
        const result = await pool.query<VentaConCliente>(query);
        return result.rows;
    },
    getVentaById: async (id: number): Promise<Ventas | null> => {
        const result = await pool.query("SELECT * FROM venta WHERE id = $1;", [id]);
        return result.rows[0] || null;
    },
    createVenta: async (customer: CrearVentasInput): Promise<Ventas> => {
        const { fecha, total, id_cliente } = customer;
        const query = "INSERT INTO venta (fecha, total, id_cliente) VALUES ($1, $2, $3) RETURNING *;";
        const values = [fecha, total, id_cliente];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    updateVenta: async (id: number, customer: ActualizarVentasInput): Promise<Ventas | null> => {
        const campos = Object.keys(customer) as (keyof ActualizarVentasInput)[];
        const setClause = campos
            .map((campo, index) => `${campo} = $${index + 1}`)
            .join(", ");
        const valores = campos.map((campo) => customer[campo]);
        const result = await pool.query(
            `UPDATE venta 
                SET ${setClause} 
                WHERE id = $${campos.length + 1} 
                RETURNING *;`, [...valores, id]);
        return result.rows[0] || null;
    },
    deleteVenta: async (id: number): Promise<boolean> => {
        const result = await pool.query("DELETE FROM venta WHERE id = $1;", [id]);
        return (result.rowCount ?? 0) > 0 ;
    }
};