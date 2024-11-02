import { Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

interface UserInfo {
    password: string,
    email: string,
}

export const userController = {
    registerUser: async (req: Request, res: Response): Promise<void> => {
        const { password, email } = req.body;
        const userInfo: UserInfo = { password, email };

        try {
            const user = await userModel.createUser(userInfo);
            res.status(201).json({ // Agregar esta respuesta
                success: true,
                user
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'internal server error when registerUser'})
        }
    },
    loginUser: async (req: Request, res: Response): Promise<void> => {
        const {email, password} = req.body

        try {
            const user = await userModel.getUserByEmail(email);

            if (!user) {
                res.status(404).json({message: 'user not found, when trying to login'});
                return
            }

            const passwordMatch = await bcrypt.compare(password+'', user.password);

            if (!passwordMatch) {
                res.status(401).json({message: 'Authentication failed because pass dont match'})
                return;
            }
            //generate token

            const accessToken = jwt.sign(
                {userid:user.id, email:user.id},
                process.env.ACCESS_TOKEN_SECRET as string,
                {expiresIn: '60s'}
            )

            //set toen in http only cookie

            res.cookie('token', accessToken, {
                httpOnly:true,
                maxAge: 60 * 1000,
            })
            res.json({
                message: 'Login Sueccesfully with token',
                user: {userid: user.id, email: user.email},
                accessToken
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({message:'internal server error on loginUser'})
        }
    },
    getUsers: async(req:Request, res:Response): Promise<void> => {
        try {
            const users = await userModel.getUsers();
            res.json(users);
        } catch (error) {
            console.log(error)
            res.status(500).json({message:'internal server error on getUsers'})
        }
    },
    verifyAuth: (req:Request, res:Response): void => {
        /**gemerate token */
        const accessToken = jwt.sign(
            {userid:req.body.userid, email:req.body.email},
            process.env.ACCESS_TOKEN_SECRET as string,
            {expiresIn: '60s'}
        );
        /**set token in httponly cookie */
        res.cookie('token', accessToken, {
            httpOnly:true,
            maxAge:60*1000,
        })

        res.json({
            message: 'Auth succesfully on verifyAuth',
            user: {userid: req.body.userid, email: req.body.email },
            accessToken,
        })
    },
    logoutUsers: (req:Request, res:Response) => {
        res.clearCookie('token')
        res.sendStatus(200);
    }
}