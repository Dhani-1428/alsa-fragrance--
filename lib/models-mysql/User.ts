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
  const pool = await import('../mysql').then(m => m.getPool())
  const connection = await pool.getConnection()
  
  try {
    // Ensure id column has AUTO_INCREMENT (fix if needed)
    try {
      const [columnInfo]: any = await connection.execute(`
        SELECT EXTRA 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = 'users' 
        AND COLUMN_NAME = 'id'
      `)
      
      if (Array.isArray(columnInfo) && columnInfo.length > 0) {
        const extra = columnInfo[0]?.EXTRA || ''
        if (!extra.includes('auto_increment')) {
          console.log('⚠️  id column does not have AUTO_INCREMENT. Attempting to fix...')
          try {
            await connection.execute(`
              ALTER TABLE users 
              MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT
            `)
            console.log('✅ Fixed id column to have AUTO_INCREMENT')
          } catch (alterError: any) {
            // If ALTER fails, log but continue - it might have foreign key constraints
            console.warn('Could not alter id column:', alterError?.message)
            // Try alternative approach: get max id and insert with next id
            const [maxResult]: any = await connection.execute('SELECT COALESCE(MAX(id), 0) as maxId FROM users')
            const maxId = maxResult?.maxId || 0
            const nextId = maxId + 1
            
            const [result]: any = await connection.execute(
              `INSERT INTO users (id, email, password, name, role) VALUES (?, ?, ?, ?, ?)`,
              [
                nextId,
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
          }
        }
      }
    } catch (checkError: any) {
      // If check fails, continue with normal insert
      console.warn('Could not check AUTO_INCREMENT:', checkError?.message)
    }
    
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
    if (!insertId) {
      throw new Error('Failed to get insert ID after user creation')
    }
    
    const newUser = await findUserById(insertId)
    if (!newUser) {
      throw new Error('Failed to retrieve created user')
    }
    return newUser
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

