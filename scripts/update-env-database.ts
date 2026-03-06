/**
 * Update .env file with correct database name
 */

import * as fs from 'fs'
import * as path from 'path'

const envPath = path.join(process.cwd(), '.env')

if (fs.existsSync(envPath)) {
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  // Update MYSQL_DATABASE if it's set to 'mysql'
  if (envContent.includes('MYSQL_DATABASE=mysql')) {
    envContent = envContent.replace(/MYSQL_DATABASE=mysql/g, 'MYSQL_DATABASE=alsafragrance')
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Updated .env file: MYSQL_DATABASE=alsafragrance\n')
  } else if (!envContent.includes('MYSQL_DATABASE=')) {
    // Add it if it doesn't exist
    envContent += '\nMYSQL_DATABASE=alsafragrance\n'
    fs.writeFileSync(envPath, envContent)
    console.log('✅ Added to .env file: MYSQL_DATABASE=alsafragrance\n')
  } else {
    console.log('✅ .env file already has MYSQL_DATABASE configured\n')
  }
} else {
  console.log('⚠️  .env file not found. Please create it manually.\n')
}
