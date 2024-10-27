"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.userController = {
    registerUser: async (req, res) => {
        const { password, email } = req.body;
        const userInfo = { password, email };
        try {
            const user = await user_1.userModel.createUser(userInfo);
            res.status(201).json({
                success: true,
                user
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'internal server error when registerUser' });
        }
    },
    loginUser: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await user_1.userModel.getUserByEmail(email);
            if (!user) {
                res.status(404).json({ message: 'user not found, when trying to login' });
                return;
            }
            const passwordMatch = await bcrypt_1.default.compare(password + '', user.password);
            if (!passwordMatch) {
                res.status(401).json({ message: 'Authentication failed because pass dont match' });
                return;
            }
            //generate token
            const accessToken = jsonwebtoken_1.default.sign({ userid: user.id, email: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
            //set toen in http only cookie
            res.cookie('token', accessToken, {
                httpOnly: true,
                maxAge: 60 * 1000,
            });
            res.json({
                message: 'Login Sueccesfully with token',
                user: { userid: user.id, email: user.email },
                accessToken
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'internal server error on loginUser' });
        }
    },
    getUsers: async (req, res) => {
        try {
            const users = await user_1.userModel.getUsers();
            res.json(users);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({ message: 'internal server error on getUsers' });
        }
    },
    verifyAuth: (req, res) => {
        /**gemerate token */
        const accessToken = jsonwebtoken_1.default.sign({ userid: req.body.userid, email: req.body.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '60s' });
        /**set token in httponly cookie */
        res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 60 * 1000,
        });
        res.json({
            message: 'Auth succesfully on verifyAuth',
            user: { userid: req.body.userid, email: req.body.email },
            accessToken,
        });
    },
    logoutUsers: (req, res) => {
        res.clearCookie('token');
        res.sendStatus(200);
    }
};
