import 'dotenv/config'
import mysql from 'mysql2/promise'

// Validate environment variables
function validateConfig() {
  const required = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE']
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required MySQL environment variables: ${missing.join(', ')}\n` +
      `Please set them in your .env file:\n` +
      `MYSQL_HOST=your_host\n` +
      `MYSQL_PORT=3306\n` +
      `MYSQL_USER=your_user\n` +
      `MYSQL_PASSWORD=your_password\n` +
      `MYSQL_DATABASE=your_database`
    )
  }
}

const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST!,
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // 10 seconds
  ssl: process.env.MYSQL_SSL === 'true' ? {
    rejectUnauthorized: false
  } : false,
}

let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (!pool) {
    validateConfig()
    pool = mysql.createPool(MYSQL_CONFIG)
  }
  return pool
}

export async function connectDB(): Promise<mysql.Pool> {
  try {
    validateConfig()
    const pool = getPool()
    const conn = await pool.getConnection()
    await conn.ping()
    conn.release()
    return pool
  } catch (error: any) {
    console.error('MySQL connection error:', error.message)
    
    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot connect to MySQL server at ${MYSQL_CONFIG.host}:${MYSQL_CONFIG.port}. ` +
        `Please check:\n` +
        `1. MySQL server is running\n` +
        `2. Host and port are correct\n` +
        `3. Firewall allows connections`
      )
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error(
        `Access denied for user '${MYSQL_CONFIG.user}'. ` +
        `Please check your username and password in .env file.`
      )
    }
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      throw new Error(
        `Database '${MYSQL_CONFIG.database}' does not exist. ` +
        `Please create the database first or check the database name in .env file.`
      )
    }
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      throw new Error(
        `Cannot reach MySQL server at ${MYSQL_CONFIG.host}. ` +
        `Please check:\n` +
        `1. Host address is correct\n` +
        `2. Server is accessible from your network\n` +
        `3. Port ${MYSQL_CONFIG.port} is open`
      )
    }
    
    throw error
  }
}

export async function query(sql: string, params?: any[]) {
  const pool = getPool()
  const [rows] = await pool.execute(sql, params)
  return rows
}

export default connectDB
