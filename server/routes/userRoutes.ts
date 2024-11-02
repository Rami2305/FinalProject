import express, { Router, Request, Response, NextFunction} from 'express'
import {verifyToken} from '../middlewares/verifyToken'
import { userController } from '../controllers/userController';
import { userModel } from 'models/user';

export const userRouter:Router = express.Router();

userRouter.post('/register', userController.registerUser)
userRouter.post('/login', userController.loginUser);
userRouter.delete('/logout', userController.logoutUsers);
userRouter.get('/all', verifyToken, userController.getUsers);
userRouter.get("/auth", verifyToken, userController.verifyAuth);


userRouter.get('/test', (req, res) => {  // Ruta de prueba
    res.json({ message: 'User routes working' })
})
