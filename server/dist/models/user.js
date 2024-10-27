"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const database_1 = require("../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.userModel = {
    createUser: async (userInfo) => {
        const { password, email } = userInfo;
        const trx = await database_1.db.transaction();
        try {
            const hashPassword = await bcrypt_1.default.hash(password + '', 10);
            const [user] = await trx('usersfp').insert({ email, password: hashPassword }, ['email', 'id']);
            await trx.commit();
            return user;
        }
        catch (error) {
            await trx.rollback();
            console.log(error);
            throw error;
        }
    },
    getUserByEmail: async (email) => {
        try {
            const user = await (0, database_1.db)('usersfp')
                .select('id', 'email', 'password')
                .where({ email })
                .first();
            return user || null;
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    },
    getUsers: async () => {
        try {
            return await (0, database_1.db)('usersfp').select('id', 'email', 'password');
        }
        catch (error) {
            throw error;
        }
    }
};
