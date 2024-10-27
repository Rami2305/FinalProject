"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { ACCESS_TOKEN_SECRET } = process.env;
const verifyToken = (req, res, next) => {
    const token = req.cookies['token'] || req.headers['x-access-token'];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: 'Forbidden', error: err.message });
        if (decoded) {
            const { userid, email } = decoded;
            req.body.userid = userid; // Asegúrate de que body tenga el tipo adecuado
            req.body.email = email; // Asegúrate de que body tenga el tipo adecuado
            next();
        }
        else {
            return res.status(403).json({ message: 'Forbidden: No decoded payload' });
        }
    });
};
exports.verifyToken = verifyToken;
