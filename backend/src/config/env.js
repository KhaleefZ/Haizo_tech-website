import dotenv from 'dotenv';
dotenv.config();
export const config = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_for_dev_only',
    databaseUrl: process.env.DATABASE_URL || '',
    corsOrigins: ['http://localhost:3000', 'http://localhost:3001']
};
