import 'dotenv/config'
import mysql from 'mysql2/promise'
import * as fs from 'fs'
import * as path from 'path'

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
      `MYSQL_DATABASE=your_database\n` +
      `MYSQL_SSL=true (if SSL is required)\n` +
      `MYSQL_SSL_CA=path/to/certificate.pem (optional, for SSL certificate)`
    )
  }
}

// Get SSL configuration
function getSSLConfig() {
  const sslEnabled = process.env.MYSQL_SSL === 'true' || process.env.MYSQL_SSL === 'REQUIRED'
  
  if (!sslEnabled) {
    return false
  }

  const sslConfig: any = {
    rejectUnauthorized: false
  }

  // If SSL certificate path is provided, read it
  if (process.env.MYSQL_SSL_CA) {
    const certPath = process.env.MYSQL_SSL_CA
    try {
      // Try absolute path first
      let certContent: string
      if (path.isAbsolute(certPath)) {
        certContent = fs.readFileSync(certPath, 'utf8')
      } else {
        // Try relative to project root
        const projectRoot = process.cwd()
        certContent = fs.readFileSync(path.join(projectRoot, certPath), 'utf8')
      }
      sslConfig.ca = certContent
    } catch (error) {
      console.warn(`Warning: Could not read SSL certificate from ${certPath}. Using SSL without certificate verification.`)
    }
  }

  return sslConfig
}

// Get MySQL config dynamically (reads from env each time)
function getMySQLConfig() {
  return {
    host: process.env.MYSQL_HOST!,
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER!,
    password: process.env.MYSQL_PASSWORD!,
    database: process.env.MYSQL_DATABASE!,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000, // 30 seconds for cloud connections
    ssl: getSSLConfig(),
  }
}

let pool: mysql.Pool | null = null
let poolConfig: string | null = null

// Reset pool - useful when database config changes
export function resetPool() {
  if (pool) {
    pool.end().catch(console.error)
    pool = null
    poolConfig = null
  }
}

export function getPool(): mysql.Pool {
  validateConfig()
  
  // Create a config signature to detect changes
  const currentConfig = JSON.stringify({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DATABASE,
  })
  
  // If config changed or pool doesn't exist, recreate it
  if (!pool || poolConfig !== currentConfig) {
    if (pool) {
      // Close old pool gracefully
      pool.end().catch((err) => {
        console.warn('Warning: Error closing old pool:', err.message)
      })
    }
    const config = getMySQLConfig()
    pool = mysql.createPool(config)
    poolConfig = currentConfig
    
    // Only log in development to avoid spam in production
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔄 MySQL pool recreated with database: ${config.database}`)
    }
  }
  
  return pool
}

export async function connectDB(): Promise<mysql.Pool> {
  try {
    validateConfig()
    const pool = getPool()
    const conn = await pool.getConnection()
    
    // Verify we're using the correct database
    try {
      const [dbResult]: any = await conn.execute('SELECT DATABASE() as currentDb')
      const currentDb = dbResult?.[0]?.currentDb
      const expectedDb = process.env.MYSQL_DATABASE
      
      if (currentDb !== expectedDb) {
        console.warn(`⚠️  Database mismatch! Connected to: ${currentDb}, Expected: ${expectedDb}`)
        console.warn(`   This may cause "table not found" errors. Please restart your server.`)
      }
    } catch (dbCheckError) {
      // Ignore database check errors
    }
    
    await conn.ping()
    conn.release()
    return pool
  } catch (error: any) {
    console.error('MySQL connection error:', error.message)
    
    const config = getMySQLConfig()
    
    // Provide helpful error messages
    if (error.code === 'ECONNREFUSED') {
      throw new Error(
        `Cannot connect to MySQL server at ${config.host}:${config.port}. ` +
        `Please check:\n` +
        `1. MySQL server is running\n` +
        `2. Host and port are correct\n` +
        `3. Firewall allows connections`
      )
    }
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error(
        `Access denied for user '${config.user}'. ` +
        `Please check your username and password in .env file.`
      )
    }
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      throw new Error(
        `Database '${config.database}' does not exist. ` +
        `Please create the database first or check the database name in .env file. ` +
        `Run: npm run db:setup`
      )
    }
    
    if (error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
      throw new Error(
        `Cannot reach MySQL server at ${config.host}. ` +
        `Please check:\n` +
        `1. Host address is correct\n` +
        `2. Server is accessible from your network\n` +
        `3. Port ${config.port} is open`
      )
    }
    
    throw error
  }
}

export async function query(sql: string, params?: any[]) {
  const pool = getPool()
  const conn = await pool.getConnection()
  
  try {
    // Ensure we're using the correct database
    const expectedDb = process.env.MYSQL_DATABASE
    if (expectedDb) {
      try {
        // Check current database - use query instead of execute for SELECT DATABASE()
        const [dbResult]: any = await conn.query('SELECT DATABASE() as currentDb')
        const currentDb = dbResult?.[0]?.currentDb
        
        // Switch to correct database if needed
        if (currentDb !== expectedDb) {
          await conn.query(`USE \`${expectedDb}\``)
          if (process.env.NODE_ENV === 'development') {
            console.log(`🔄 Switched to database: ${expectedDb}`)
          }
        }
      } catch (dbError: any) {
        // If USE command fails, log error but try to continue
        console.error('Database switch error:', dbError.message)
        if (process.env.NODE_ENV === 'development') {
          console.warn('Warning: Could not verify/switch database:', dbError.message)
        }
        // Don't throw - the connection might still work with the correct database from pool config
      }
    }
    
    // Execute the query
    const [rows] = await conn.execute(sql, params)
    return rows
  } catch (error: any) {
    // Log the actual error for debugging
    console.error('Query error:', {
      sql: sql.substring(0, 100),
      error: error.message,
      code: error.code,
      errno: error.errno
    })
    throw error
  } finally {
    conn.release()
  }
}

export default connectDB
