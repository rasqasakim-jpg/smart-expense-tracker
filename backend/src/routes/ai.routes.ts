import { Router } from 'express';
import { AiController } from '../controllers/ai.controller';
// Pastikan path middleware auth ini sesuai dengan project-mu
import { AuthMiddleware } from '../middlewares/auth.middleware'; 

const router = Router();
const aiController = new AiController();
const authMiddleware = new AuthMiddleware();
// GET http://localhost:5000/api/ai/insight
// Middleware 'authenticate' wajib ada biar kita tau siapa yang request (req.user.id)
router.get('/insight', authMiddleware.handle, aiController.getInsight);

export default router;