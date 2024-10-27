"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.questionRouter = void 0;
const express_1 = __importDefault(require("express"));
const questionController_1 = require("../controllers/questionController");
const questionRouter = express_1.default.Router();
exports.questionRouter = questionRouter;
const getQuestionMiddleware = async (req, res, next) => {
    try {
        await questionController_1.questionController.getQuestion(req, res);
    }
    catch (error) {
        next(error);
    }
};
questionRouter.get('/', getQuestionMiddleware);
