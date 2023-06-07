import { createPool } from 'mysql2/promise';

export async function connectCistecServer() {
  const conexion = await createPool({
    host: process.env.SERVER,
    user: process.env.MYSQL_USER,
    port: Number(process.env.MYSQL_PORT),
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    connectionLimit: 100,
  });
  return conexion;
}
