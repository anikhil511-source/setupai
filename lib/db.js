import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

export async function query(sql, values = []) {
  const conn = await pool.getConnection();
  const [result] = await conn.query(sql, values);
  conn.release();
  return result;
}