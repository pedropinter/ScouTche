import { Router } from 'express';
const bcrypt = require("bcrypt");
import multer from 'multer';
import path from 'path';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from "../middlewares/auth-middleware";

const router = Router();



// Rotas
router.post('/register',authenticateToken, UserController.register);
router.post('/login',authenticateToken, UserController.login);
router.put('/perfil/:id', authenticateToken,UserController.atualizarPerfil);
router.get('/perfil/:id',authenticateToken, UserController.listarPerfil);
router.post('/perfil/:id/avatar',authenticateToken, UserController.uploadFoto);



export default router;