import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { UserController } from '../controllers/UserController';

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
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.put('/perfil/:id', UserController.atualizarPerfil);
router.get('/perfil/:id', UserController.listarPerfil);
router.post('/perfil/:id/foto', upload.single('foto'), UserController.uploadFoto);
router.delete('/perfil/:id/foto', UserController.removerFoto);


export default router;
