import { Router } from 'express';
import { QuadraController } from '../controllers/quadraController';

const routes = Router();
const quadraController = new QuadraController();

routes.get('/peneira', quadraController.list);
routes.post('/peneira', quadraController.create);
routes.get('/peneira/:id', quadraController.show);
routes.put('/peneira/:id', quadraController.update);
routes.delete('/peneira/:id', quadraController.delete);

export default routes;