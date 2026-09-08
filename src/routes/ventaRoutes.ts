import { Router } from "express";
//import {validarCustomer} from "../middleware/validate-customer.js";
//import {customerSchema, updateCustomerSchema} from "../schema/customer.schema.js";
import {getVenta, 
    getVentaId, 
    postVenta, 
    putVenta, 
    deleteVenta} from "../controllers/ventaController.js";

const router: Router = Router();

router.get("/ventas", getVenta);
router.get("/ventas/:id", getVentaId);
router.post("/ventas",/*validarCustomer(customerSchema),*/ postVenta);
router.put("/ventas/:id",/*validarCustomer(updateCustomerSchema),*/ putVenta);
router.delete("/ventas/:id", deleteVenta);

export default router;