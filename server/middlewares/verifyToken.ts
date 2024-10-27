import jwt, { JwtPayload } from 'jsonwebtoken'
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
dotenv.config();
 

const { ACCESS_TOKEN_SECRET } = process.env;

interface AuthRequest extends Request {
    body: {
        userid?: string;
        email?: string;
    }    
}
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies['token'] || req.headers['x-access-token']

    if (!token) { 
        res.status(401).json({ message: 'Unauthorized' });
        return
    }
    jwt.verify(token, ACCESS_TOKEN_SECRET as string, (err:any, decoded:any) => {
        if (err) 
            return res.status(403).json({ message: 'Forbidden', error: err.message });

        if (decoded) {
            const { userid, email } = decoded;
            req.body.userid = userid; // Asegúrate de que body tenga el tipo adecuado
            req.body.email = email; // Asegúrate de que body tenga el tipo adecuado
            next();
        } else {
            return res.status(403).json({ message: 'Forbidden: No decoded payload' });
        }
    });
};