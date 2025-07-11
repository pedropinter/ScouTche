import express, { Application, Request, Response } from 'express';
import { AppDataSource } from './database/data-source';
import eventoRoutes from './routes/eventoRoutes'; 
import UserRoutes from './routes/UserRoutes';
import QuadraRoutes from './routes/quadraRoutes';

// ou o nome do seu arquivo

import cors from "cors";
import path from 'path';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ]
}));

app.use(express.static('public'));

// Routes
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
    return;
});

AppDataSource.initialize()
    .then(() => {
        //app.use('/api', routesUser);
        app.use('/api',eventoRoutes, UserRoutes,QuadraRoutes);
        app.listen(3000, () => console.log('Server rodando na porta 3000'));
    })
    .catch((error) => console.log(error));