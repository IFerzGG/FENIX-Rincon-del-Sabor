import { Router } from "express";
import {validarProducto} from "../middleware/validate-product.js";
import { productQueryParams, productSchema } from "../schema/product.schema.js";
import {getMenu, 
        getProduct, 
        postProduct, 
        putProduct, 
        deleteProduct } from "../controllers/product.controller.js";

const router: Router = Router();

router.get("/menu", getMenu);
router.get("/menu/:id", getProduct);
router.post("/menu",validarProducto(productSchema), postProduct);
router.put("/menu/:id",putProduct);
router.delete("/menu/:id", deleteProduct);

export default router;