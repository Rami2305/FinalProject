import express, { Router, Request, Response, NextFunction} from 'express'
import { questionController } from '../controllers/questionController'

const questionRouter = express.Router()

const getQuestionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await questionController.getQuestion(req, res);
    } catch (error) {
        next(error);
    }
};

questionRouter.get('/', getQuestionMiddleware);
export { questionRouter }
