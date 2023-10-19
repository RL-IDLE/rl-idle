import { env } from '../env';

export default () => ({
  db_kind: 'postgres',
  db_host: env.DATABASE_HOST || 'localhost',
  db_port: env.DATABASE_PORT ? parseInt(env.DATABASE_PORT, 10) : 5432,
  db_user: env.DATABASE_USER || 'root',
  db_pass: env.DATABASE_PASS || 'root',
  db_name: env.DATABASE_KIND || 'basic',
});
