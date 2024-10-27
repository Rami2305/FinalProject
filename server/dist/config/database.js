"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.db = void 0;
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;
if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD || !PGPORT) {
    throw new Error('Missing required environment variables for database connection');
}
exports.db = (0, knex_1.default)({
    client: 'pg',
    connection: {
        host: PGHOST,
        port: parseInt(PGPORT, 10), // Convertir a número
        user: PGUSER,
        database: PGDATABASE,
        password: PGPASSWORD,
        ssl: { rejectUnauthorized: false } // Para evitar problemas con conexiones SSL
    }
});
const initializeDatabase = async () => {
    try {
        const hasAuthUsersTable = await exports.db.schema.hasTable('usersfp');
        if (hasAuthUsersTable) {
            console.log('usersfp table exists and is ready');
            // Verificar que la tabla está accesible
            const userCount = await (0, exports.db)('usersfp').count('* as count').first();
            console.log(`Found ${userCount?.count} users`);
        }
        else {
            console.warn('Warning: usersfp table not found');
        }
        // Crear tabla de preguntas si no existe
        const hasQuestionsTable = await exports.db.schema.hasTable('questions');
        if (!hasQuestionsTable) {
            await exports.db.schema.createTable('questions', table => {
                table.increments('id');
                table.text('question').notNullable();
                table.string('category', 100).notNullable();
                table.text('correct_answer').notNullable();
                table.specificType('incorrect_answers', 'text ARRAY').notNullable();
                table.string('difficulty', 50);
                table.timestamps(true, true);
            });
            console.log('Questions table created successfully');
        }
        // Si después necesitas más tablas (por ejemplo, para usuarios o scores)
        // las puedes agregar aquí fácilmente
        console.log('Database initialized successfully');
    }
    catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
