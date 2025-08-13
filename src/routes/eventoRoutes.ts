import { Router } from 'express';
import { EventoController } from '../controllers/eventoController';

const routes = Router();
const eventoController = new EventoController();

routes.get('/get/peneira', eventoController.list);
routes.post('/post/peneira', eventoController.create);
routes.get('/get/peneira/:id', eventoController.show);
routes.put('/put/peneira/:id', eventoController.update);
routes.delete('/delete/peneira/:id', eventoController.delete);

export default routes;