import express, { type Application, type Request, type Response } from "express";
import cors from 'cors';

const app: Application = express();

app.use(express.json());
app.use(cors());

app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({
        massage: "Selamat datang di API Smart Expanse Tracker",
        status: "Active"
    });

});


export default app;



