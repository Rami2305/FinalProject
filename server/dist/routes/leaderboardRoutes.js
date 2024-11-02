"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaderboardRouter = void 0;
const express_1 = __importDefault(require("express"));
const leaderboardController_1 = require("../controllers/leaderboardController");
const leaderboardRouter = express_1.default.Router();
exports.leaderboardRouter = leaderboardRouter;
const getUserScoreMiddleware = async (req, res, next) => {
    try {
        await leaderboardController_1.leaderboardController.getUserScore(req, res);
    }
    catch (error) {
        next(error);
    }
};
const updateUserScore = async (req, res, next) => {
    try {
        await leaderboardController_1.leaderboardController.updateUserScore(req, res);
    }
    catch (error) {
        next(error);
    }
};
leaderboardRouter.get('/:email', getUserScoreMiddleware);
leaderboardRouter.post('/', updateUserScore);
