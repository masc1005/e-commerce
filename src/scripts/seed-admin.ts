import { db } from '@/config/database/connection'
import { usersTable } from '@/config/database/schemas'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@loomi.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador'

async function seedAdmin() {
  try {
    console.log('🌱 Verificando se admin padrão existe...')

    const existingAdmin = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, ADMIN_EMAIL))
      .limit(1)

    if (existingAdmin.length > 0) {
      console.log('✅ Admin já existe no banco de dados')
      process.exit(0)
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

    await db.insert(usersTable).values({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      type: 'admin',
    })

    console.log('✅ Admin padrão criado com sucesso!')
    console.log(`📧 Email: ${ADMIN_EMAIL}`)
    console.log(`🔑 Senha: ${ADMIN_PASSWORD}`)
    console.log('')
    console.log(
      '⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!',
    )

    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao criar admin padrão:', error)
    process.exit(1)
  }
}

seedAdmin()
