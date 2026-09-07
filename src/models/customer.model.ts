import { pool } from '../config/db.js';

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
        const result = await pool.query("SELECT * FROM customers;");
        console.log(result);
        return result.rows;
    },
    getCustomerById: async (id: number): Promise<Customer | null> => {
        const result = await pool.query("SELECT * FROM customers WHERE id = $1;", [id]);
        return result.rows[0] || null;
    },
    createCustomer: async (customer: CrearCustomerInput): Promise<Customer> => {
        const { nombre, email, telefono } = customer;
        const query = "INSERT INTO customers (nombre, email, telefono) VALUES ($1, $2, $3) RETURNING *;";
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
            `UPDATE customers 
                SET ${setClause} 
                WHERE id = $${campos.length + 1} 
                RETURNING *;`, [...valores, id]);
        return result.rows[0] || null;
    },
    deleteCustomer: async (id: number): Promise<boolean> => {
        const result = await pool.query("DELETE FROM customers WHERE id = $1;", [id]);
        return (result.rowCount ?? 0) > 0 ;
    }
};