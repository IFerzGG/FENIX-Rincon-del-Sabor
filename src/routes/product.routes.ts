import { Router } from "express";
import {getMenu, 
        getProduct, 
        postProduct, 
        putProduct, 
        deleteProduct } from "../controllers/product.controller.js";

const router: Router = Router();

router.get("/menu", getMenu);
router.get("/menu/:id", getProduct);
router.post("/menu", postProduct);
router.put("/menu/:id", putProduct);
router.delete("/menu/:id", deleteProduct);

export default router;