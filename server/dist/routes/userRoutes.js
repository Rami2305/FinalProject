"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const verifyToken_1 = require("../middlewares/verifyToken");
const userController_1 = require("../controllers/userController");
exports.userRouter = express_1.default.Router();
exports.userRouter.post('/register', userController_1.userController.registerUser);
exports.userRouter.post('/login', userController_1.userController.loginUser);
exports.userRouter.delete('/logout', userController_1.userController.logoutUsers);
exports.userRouter.get('/all', verifyToken_1.verifyToken, userController_1.userController.getUsers);
exports.userRouter.get("/auth", verifyToken_1.verifyToken, userController_1.userController.verifyAuth);
exports.userRouter.get('/test', (req, res) => {
    res.json({ message: 'User routes working' });
});
