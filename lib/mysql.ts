import mysql from 'mysql2/promise'

// MySQL connection configuration
const MYSQL_CONFIG = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'alsa_fragrance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
}

// Create connection pool
let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(MYSQL_CONFIG)
  }
  return pool
}

export async function connectDB(): Promise<mysql.Pool> {
  const connectionPool = getPool()
  
  // Test connection
  try {
    const connection = await connectionPool.getConnection()
    await connection.ping()
    connection.release()
    return connectionPool
  } catch (error: any) {
    console.error('MySQL connection error:', error)
    throw new Error(`Failed to connect to MySQL: ${error.message}`)
  }
}

export async function query(sql: string, params?: any[]): Promise<any> {
  const connectionPool = getPool()
  try {
    const [results] = await connectionPool.execute(sql, params)
    return results
  } catch (error: any) {
    console.error('MySQL query error:', error)
    throw error
  }
}

export default connectDB

