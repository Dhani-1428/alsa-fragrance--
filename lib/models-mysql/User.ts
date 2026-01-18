import { query, getPool } from '../mysql'
import bcrypt from 'bcryptjs'

export interface IUser {
  id?: number
  email: string
  password: string
  name?: string
  role: 'client' | 'admin'
  createdAt?: Date
  updatedAt?: Date
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  const results = await query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()])
  if (Array.isArray(results) && results.length > 0) {
    return results[0] as IUser
  }
  return null
}

export async function findUserById(id: number): Promise<IUser | null> {
  const results = await query('SELECT * FROM users WHERE id = ?', [id])
  if (Array.isArray(results) && results.length > 0) {
    return results[0] as IUser
  }
  return null
}

export async function createUser(userData: {
  email: string
  password: string
  name?: string
  role?: 'client' | 'admin'
}): Promise<IUser> {
  const hashedPassword = await bcrypt.hash(userData.password, 10)
  
  // Get connection to access insertId
  const pool = getPool()
  const connection = await pool.getConnection()
  
  try {
    // First, try normal INSERT (if AUTO_INCREMENT works)
    try {
      const [result]: any = await connection.execute(
        `INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)`,
        [
          userData.email.toLowerCase().trim(),
          hashedPassword,
          userData.name || null,
          userData.role || 'client',
        ]
      )
      
      const insertId = result.insertId
      if (insertId) {
        const newUser = await findUserById(insertId)
        if (newUser) {
          return newUser
        }
      }
    } catch (insertError: any) {
      // If insert fails with "Field 'id' doesn't have a default value" error
      if (insertError?.message?.includes("doesn't have a default value") || 
          insertError?.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        console.log('⚠️  AUTO_INCREMENT not working, using manual ID calculation...')
        
        // Get max ID and calculate next ID
        const [maxResult]: any = await connection.execute('SELECT COALESCE(MAX(CAST(id AS UNSIGNED)), 0) as maxId FROM users')
        let maxId = 0
        if (Array.isArray(maxResult) && maxResult.length > 0 && maxResult[0]) {
          const rawMaxId = maxResult[0].maxId
          // Ensure it's a number and handle different formats
          if (typeof rawMaxId === 'number') {
            maxId = Math.floor(Math.abs(rawMaxId)) // Use abs to handle negative numbers
          } else if (typeof rawMaxId === 'string') {
            const parsed = parseInt(rawMaxId.replace(/[^0-9-]/g, ''), 10)
            maxId = isNaN(parsed) ? 0 : Math.floor(Math.abs(parsed))
          } else if (rawMaxId && typeof rawMaxId === 'bigint') {
            maxId = Number(rawMaxId)
          } else {
            maxId = 0
          }
        }
        
        // Ensure maxId is within INT range
        if (maxId > 2147483647) {
          maxId = 0 // Reset if somehow too large
        }
        
        const nextId = maxId + 1
        
        // Ensure nextId is a valid integer (INT range is 1 to 2147483647)
        if (nextId > 2147483647 || nextId < 1) {
          throw new Error(`Calculated ID ${nextId} is out of valid INT range (1-2147483647). Current max ID: ${maxId}. Please fix the table AUTO_INCREMENT or clean up the table.`)
        }
        
        console.log(`Using manual ID: ${nextId} (previous max: ${maxId}, type: ${typeof nextId})`)
        
        // Insert with explicit ID (ensure it's a number, not string or bigint)
        const cleanId = Number(nextId)
        if (isNaN(cleanId) || cleanId < 1 || cleanId > 2147483647) {
          throw new Error(`Invalid ID calculated: ${nextId} -> ${cleanId}`)
        }
        
        await connection.execute(
          `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
          [
            cleanId, // Clean integer value
            userData.email.toLowerCase().trim(),
            hashedPassword,
            userData.name || null,
            userData.role || 'client',
          ]
        )
        
        const newUser = await findUserById(nextId)
        if (!newUser) {
          throw new Error('Failed to retrieve created user')
        }
        return newUser
      } else {
        // If it's a different error, re-throw it
        throw insertError
      }
    }
    
    // This should not be reached, but just in case
    throw new Error('Unexpected error during user creation')
  } finally {
    connection.release()
  }
}

export async function updateUserPassword(id: number, newPassword: string): Promise<void> {
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id])
}

export default {
  findOne: async (filter: { email?: string; _id?: string | number }) => {
    if (filter.email) {
      return await findUserByEmail(filter.email)
    }
    if (filter._id) {
      const id = typeof filter._id === 'string' ? parseInt(filter._id) : filter._id
      return await findUserById(id)
    }
    return null
  },
  create: createUser,
  findById: findUserById,
  findByIdAndUpdate: async (id: number, update: Partial<IUser>) => {
    const updates: string[] = []
    const values: any[] = []
    
    if (update.email) {
      updates.push('email = ?')
      values.push(update.email.toLowerCase().trim())
    }
    if (update.name !== undefined) {
      updates.push('name = ?')
      values.push(update.name || null)
    }
    if (update.role) {
      updates.push('role = ?')
      values.push(update.role)
    }
    if (update.password) {
      const hashedPassword = await bcrypt.hash(update.password, 10)
      updates.push('password = ?')
      values.push(hashedPassword)
    }
    
    if (updates.length === 0) {
      return await findUserById(id)
    }
    
    values.push(id)
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values)
    return await findUserById(id)
  },
}

