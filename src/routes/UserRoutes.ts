import { Router } from 'express';
const bcrypt = require("bcrypt");
import multer from 'multer';
import path from 'path';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from "../middlewares/auth-middleware";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Caminho absoluto para a pasta uploads (crie ela se não existir)
    cb(null, path.resolve(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    // Evita conflito com nomes iguais, você pode melhorar esse nome gerando um hash/timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Rotas
router.post('/register',authenticateToken, UserController.register);
router.post('/login',authenticateToken, UserController.login);
router.put('/perfil/:id', authenticateToken,UserController.atualizarPerfil);
router.get('/perfil/:id',authenticateToken, UserController.listarPerfil);
router.post('/perfil/:id/foto',authenticateToken, upload.single('foto'), UserController.uploadFoto);
router.delete('/perfil/:id/foto',authenticateToken, UserController.removerFoto);


export default router;