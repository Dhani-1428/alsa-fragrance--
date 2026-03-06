/**
 * Script to download AWS RDS Global Bundle Certificate
 * Run with: npx ts-node scripts/download-rds-certificate.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const CERT_URL = 'https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem'
const CERT_DIR = path.join(process.cwd(), 'certs')
const CERT_FILE = path.join(CERT_DIR, 'global-bundle.pem')

async function downloadCertificate(): Promise<void> {
  console.log('📥 Downloading AWS RDS Global Bundle Certificate...\n')

  // Create certs directory if it doesn't exist
  if (!fs.existsSync(CERT_DIR)) {
    fs.mkdirSync(CERT_DIR, { recursive: true })
    console.log(`✅ Created directory: ${CERT_DIR}`)
  }

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(CERT_FILE)

    https.get(CERT_URL, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          console.log(`✅ Certificate downloaded successfully to: ${CERT_FILE}`)
          console.log('\n📝 Next steps:')
          console.log('   1. Update your .env file with: MYSQL_SSL_CA=./certs/global-bundle.pem')
          console.log('   2. Restart your application\n')
          resolve()
        })
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirect
        https.get(response.headers.location!, (redirectResponse) => {
          redirectResponse.pipe(file)
          file.on('finish', () => {
            file.close()
            console.log(`✅ Certificate downloaded successfully to: ${CERT_FILE}`)
            console.log('\n📝 Next steps:')
            console.log('   1. Update your .env file with: MYSQL_SSL_CA=./certs/global-bundle.pem')
            console.log('   2. Restart your application\n')
            resolve()
          })
        }).on('error', (err) => {
          fs.unlinkSync(CERT_FILE)
          reject(err)
        })
      } else {
        fs.unlinkSync(CERT_FILE)
        reject(new Error(`Failed to download certificate: ${response.statusCode} ${response.statusMessage}`))
      }
    }).on('error', (err) => {
      fs.unlinkSync(CERT_FILE)
      reject(err)
    })
  })
}

// Run the script
downloadCertificate()
  .then(() => {
    console.log('✅ Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Error downloading certificate:', error.message)
    process.exit(1)
  })
