"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardController = void 0;
const database_1 = require("../config/database");
exports.leaderboardController = {
    getUserScore: async (req, res) => {
        const { email } = req.params;
        try {
            const userScore = await (0, database_1.db)('leaderboard')
                .where('email', email)
                .select('score')
                .first();
            if (!userScore) {
                return res.status(404).json({ score: 0 });
            }
            return res.json(userScore);
        }
        catch (error) {
            console.error('Error getting user score:', error);
            return res.status(500).json({ error: 'Error fetching user score' });
        }
    },
    updateUserScore: async (req, res) => {
        const { userId, userEmail, score } = req.body;
        console.log('Received data:', { userId, userEmail, score });
        try {
            await (0, database_1.db)('leaderboard')
                .insert({ email: userEmail, score })
                .onConflict('email')
                .merge();
            return res.sendStatus(200);
        }
        catch (error) {
            console.error('Error updating user score:', error);
            return res.status(500).json({ error: 'Error updating user score' });
        }
    },
};
