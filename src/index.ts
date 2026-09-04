import express, { type Request, type Response } from "express"; 
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors"
import { pool } from "./config/db.js";
import productRouter from "./routes/product.routes.js";

const port = process.env.PORT || 3000; 



const app = express();

// Middlewares 
app.use(express.json());
app.use(cors())

app.use("/api/docs", swaggerRouter)

app.get("/", (req: Request, res: Response) => {
    /*#swagger.tags = ['Tests']*/
    res.json({
        status: "Server online",
        version: "1.0.0"
    });
});

app.use("/api", productRouter);

app.listen(port, async () => {
    console.log(`URL: http://localhost:${port}`);
    try {
        const corriendo = await pool.query("SELECT NOW()");
        console.log(
            `CONECTADO A POSTGRESQL CON EXITO HORA DEL SERVIDOR ${corriendo.rows[0].now}`,
        );
    } catch (error) {
        console.log("ERROR EN LA CONEXION");
    }
});