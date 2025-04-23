import express from 'express';
import { doLogin } from '../controllers/login.controller.js';

const router = express.Router();

// Define the login route
router.post('/api/login', doLogin);

export { router as loginRouter }; // Export with a unique name