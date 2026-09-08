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
    getVentaById: async (id: number): Promise<VentaConCliente | null> => {
        const query = `SELECT venta.id, venta.fecha, venta.total, venta.id_cliente,
            customers.nombre AS nombre_cliente
            FROM venta 
            INNER JOIN customers ON venta.id_cliente = customers.id
            WHERE venta.id = $1;`;
        const result = await pool.query<VentaConCliente>(query, [id]);
        return result.rows[0] || null;
    },
    createVenta: async (sell: CrearVentasInput): Promise<Ventas> => {
        const { fecha, total, id_cliente } = sell;
        const query = "INSERT INTO venta (fecha, total, id_cliente) VALUES ($1, $2, $3) RETURNING *;";
        const values = [fecha, total, id_cliente];
        const result = await pool.query<Ventas>(query, values);
        const venta = result.rows[0];
        if (!venta) {
            throw new Error('No se pudo crear la venta');
        }
        return venta;
    },
    updateVenta: async (id: number, venta: ActualizarVentasInput): Promise<Ventas | null> => {
        const campos = Object.keys(venta) as (keyof ActualizarVentasInput)[];
        const setClause = campos
            .map((campo, index) => `${campo} = $${index + 1}`)
            .join(", ");
        const valores = campos.map((campo) => venta[campo]);
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