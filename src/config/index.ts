import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const HAS_CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, MONGODB_URI, MONGODB_URI_DEV, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
