import { Router } from "express";
import {validarCustomer} from "../middleware/validate-customer.js";
import {customerSchema, updateCustomerSchema} from "../schema/customer.schema.js";
import {getCustomers, 
    getCustomersId, 
    postCustomer, 
    putCustomer, 
    deleteCustomer} from "../controllers/customer.controller.js";

const router: Router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersId);
router.post("/customers",validarCustomer(customerSchema), postCustomer);
router.put("/customers/:id",validarCustomer(updateCustomerSchema), putCustomer);
router.delete("/customers/:id", deleteCustomer);

export default router;