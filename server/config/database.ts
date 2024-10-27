import knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, PGPORT } = process.env;

if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD || !PGPORT) {
    throw new Error('Missing required environment variables for database connection');
}

export const db = knex({
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

export const initializeDatabase = async () => {
    try {
        const hasAuthUsersTable = await db.schema.hasTable('usersfp');
        if (hasAuthUsersTable) {
            console.log('usersfp table exists and is ready');
            // Verificar que la tabla está accesible
            const userCount = await db('usersfp').count('* as count').first();
            console.log(`Found ${userCount?.count} users`);
        } else {
            console.warn('Warning: usersfp table not found');
        }

        // Crear tabla de preguntas si no existe
        const hasQuestionsTable = await db.schema.hasTable('questions');
        if (!hasQuestionsTable) {
            await db.schema.createTable('questions', table => {
                table.increments('id');
                table.text('question_text').notNullable();
                table.text('correct_answer').notNullable();
                table.specificType('options', 'text[]').notNullable();
                table.text('category').notNullable();
            });
            console.log('Questions table created successfully');
        }

        console.log('Database initialized successfully');

        // Si después necesitas más tablas (por ejemplo, para usuarios o scores)
        // las puedes agregar aquí fácilmente
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};