import { Request, Response } from 'express';
import { db } from '../config/database';

interface LeaderboardController {
  getUserScore: (req: Request, res: Response) => Promise<Response>;
  updateUserScore: (req: Request, res: Response)=> Promise<Response>
}

export const leaderboardController: LeaderboardController = {
  getUserScore: async (req: Request, res: Response): Promise<Response> => {
    const { email } = req.params;
    try {
      const userScore = await db('leaderboard')
        .where('email', email)
        .select('score')
        .first();
      if (!userScore) {
        return res.status(404).json({ score: 0 });
      }
      return res.json(userScore);
    } catch (error) {
      console.error('Error getting user score:', error);
      return res.status(500).json({ error: 'Error fetching user score' });
    }
  },
  updateUserScore: async (req: Request, res: Response): Promise<Response> => {
    const { userId, userEmail, score } = req.body;
    console.log('Received data:', { userId, userEmail, score });
    try {
        await db('leaderboard')
        .insert({ email: userEmail, score })
        .onConflict('email')
        .merge();
      return res.sendStatus(200);
    } catch (error) {
      console.error('Error updating user score:', error);
      return res.status(500).json({ error: 'Error updating user score' });
    }
  },
  
  
};