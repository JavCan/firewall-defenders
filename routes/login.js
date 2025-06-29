import express from 'express';
import { doLogin } from '../controllers/login.controller.js';

const router = express.Router();

router.post('/api/login', doLogin);

export { router as loginRouter };