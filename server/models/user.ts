import { Knex } from 'knex';
import {db } from '../config/database'
import bcrypt from 'bcrypt'

interface UserInfo {
    password: string,
    email: string,
}

interface User {
    id: number;
    email: string;
    password: string;
}

export const userModel = {
    createUser: async (userInfo:UserInfo): Promise<Omit<User,'password'>> => {
        const { password, email } = userInfo;

        const trx: Knex.Transaction =await db.transaction()

        try {
            const hashPassword = await bcrypt.hash(password+'',10)

            const [user]: User[] = await trx('usersfp').insert(
                {email, password:hashPassword},
                ['email', 'id']
            );
            await trx.commit();
            return user
        } catch (error) {
            await trx.rollback();
            console.log(error);
            throw error
        }
    },
    getUserByEmail: async (email:string): Promise<User | null> => {
        try {
            const user = await db('usersfp')
            .select('id', 'email', 'password')
            .where({ email})
            .first()
            return user || null;
        } catch (error) {
            console.error(error);
            throw error
        }
    },
    getUsers: async ():Promise<User[]> => {
        try {
            return await db('usersfp').select('id', 'email', 'password')
        } catch (error) {
            throw error
        }
    }
}