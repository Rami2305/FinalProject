import express, { Router, Request, Response, NextFunction } from 'express';
import { leaderboardController } from '../controllers/leaderboardController';

const leaderboardRouter = express.Router();

const getUserScoreMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await leaderboardController.getUserScore(req, res);
  } catch (error) {
    next(error);
  }
};

const updateUserScore = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await leaderboardController.updateUserScore(req, res);
  } catch (error) {
    next(error);
  }
};


leaderboardRouter.get('/:email', getUserScoreMiddleware);
leaderboardRouter.post('/', updateUserScore)
export { leaderboardRouter };