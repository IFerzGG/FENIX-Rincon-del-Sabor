import { pool } from '../config/db.js';
import type { CustomerQueryParams } from '../schema/customer.schema.js';

export interface Customer {
    id: number;
    nombre: string;
    email: string;
    telefono: number;
}

export type CrearCustomerInput = Omit<Customer, 'id'>;
export type ActualizarCustomerInput = Partial<CrearCustomerInput>;

export const ModelCustomer = {
    getAllCustomers: async (): Promise<Customer[]> => {
        const result = await pool.query("SELECT * FROM clientes;");
        console.log(result);
        return result.rows;
    },
    getCustomerById: async (id: number): Promise<Customer | null> => {
        const result = await pool.query("SELECT * FROM clientes WHERE id_clientes = $1;", [id]);
        return result.rows[0] || null;
    },
    createCustomer: async (customer: CrearCustomerInput): Promise<Customer> => {
        const { nombre, email, telefono } = customer;
        const query = "INSERT INTO clientes (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *;";
        const values = [nombre, email, telefono];
        const result = await pool.query(query, values);
        return result.rows[0];
    },
    updateCustomer: async (id: number, customer: ActualizarCustomerInput): Promise<Customer | null> => {
        const campos = Object.keys(customer) as (keyof ActualizarCustomerInput)[];
        const setClause = campos
            .map((campo, index) => `${campo} = $${index + 1}`)
            .join(", ");
        const valores = campos.map((campo) => customer[campo]);
        const result = await pool.query(
            `UPDATE clientes 
                SET ${setClause} 
                WHERE id_clientes = $${campos.length + 1} 
                RETURNING *;`, [...valores, id]);
        return result.rows[0] || null;
    },
    deleteCustomer: async (id: number): Promise<boolean> => {
        const result = await pool.query("DELETE FROM clientes WHERE id = $1;", [id]);
        return (result.rowCount ?? 0) > 0 ;
    },
    getFindFilter: async (filtro:CustomerQueryParams) => {
        const condiciones: string[] = [];
        const parametros: unknown[] = [];
        let index = 1;
        if(filtro.nombre !== undefined){
            condiciones.push(`nombre ILIKE $${index}`);
            parametros.push(filtro.nombre);
            index ++;
        }

        const where = condiciones.length > 0
            ? `WHERE ${condiciones.join(`AND`)}`
            : "";
        const countQuery = `SELECT COUNT(*) FROM clientes ${where}`;
        const countResult = await pool.query(countQuery,parametros);
        const total = Number(countResult.rows[0].count);

        const pagina = filtro.page ?? 1;
        const limite = filtro.limit ?? 10;
        const offset = (pagina - 1) * limite;
        parametros.push(limite);
        parametros.push(offset);

        const sql = ` SELECT * FROM clientes ${where} ORDER BY id_clientes ASC
            LIMIT $${index} 
            OFFSET $${index + 1}`;
        const result = await pool.query(sql,parametros);
        return {
            data: result.rows,
            total,
            pagina,
            limite,
            totalPages: Math.ceil(total / limite) || 1,
        };
    }
};