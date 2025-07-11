import { Router } from 'express';
import { EventoController } from '../controllers/eventoController';

const routes = Router();
const eventoController = new EventoController();

routes.get('/peneira', eventoController.list);
routes.post('/peneira', eventoController.create);
routes.get('/peneira/:id', eventoController.show);
routes.put('/peneira/:id', eventoController.update);
routes.delete('/peneira/:id', eventoController.delete);

export default routes;