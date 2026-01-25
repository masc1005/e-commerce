import { db } from '@/config/database/connection'
import { usersTable, productsTable } from '@/config/database/schemas'
import { eq, count } from 'drizzle-orm'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@loomi.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ADMIN_NAME = process.env.ADMIN_NAME || 'Administrador'

const SAMPLE_PRODUCTS = [
  {
    name: 'Água Mineral 500ml',
    description: 'Água mineral natural sem gás, garrafa de 500ml',
    price: '2.50',
    stock: 100,
  },
  {
    name: 'Refrigerante Cola 350ml',
    description: 'Refrigerante sabor cola, lata de 350ml',
    price: '4.99',
    stock: 80,
  },
  {
    name: 'Suco de Laranja Natural 1L',
    description: 'Suco de laranja 100% natural, sem açúcar adicionado',
    price: '12.90',
    stock: 50,
  },
  {
    name: 'Café Premium 500g',
    description: 'Café torrado e moído, grãos selecionados',
    price: '28.90',
    stock: 40,
  },
  {
    name: 'Chocolate ao Leite 200g',
    description: 'Barra de chocolate ao leite premium',
    price: '15.50',
    stock: 60,
  },
  {
    name: 'Biscoito Integral 150g',
    description: 'Biscoito integral com fibras, sem açúcar',
    price: '8.90',
    stock: 70,
  },
  {
    name: 'Azeite Extra Virgem 500ml',
    description: 'Azeite de oliva extra virgem importado',
    price: '45.00',
    stock: 30,
  },
  {
    name: 'Arroz Integral 1kg',
    description: 'Arroz integral tipo 1, rico em fibras',
    price: '9.90',
    stock: 90,
  },
  {
    name: 'Feijão Carioca 1kg',
    description: 'Feijão carioca selecionado, tipo 1',
    price: '8.50',
    stock: 85,
  },
  {
    name: 'Macarrão Espaguete 500g',
    description: 'Macarrão espaguete de sêmola, grano duro',
    price: '6.90',
    stock: 75,
  },
]

async function seedAdmin() {
  console.log('🌱 Verificando se admin padrão existe...')

  const existingAdmin = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, ADMIN_EMAIL))
    .limit(1)

  if (existingAdmin.length > 0) {
    console.log('✅ Admin já existe no banco de dados')
    return
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
  console.log('⚠️  IMPORTANTE: Altere a senha do admin após o primeiro login!')
}

async function seedProducts() {
  console.log('')
  console.log('📦 Verificando produtos no banco de dados...')

  const [productCount] = await db.select({ count: count() }).from(productsTable)

  if (productCount.count > 0) {
    console.log(
      `✅ Já existem ${productCount.count} produtos no banco de dados`,
    )
    return
  }

  console.log('📦 Inserindo produtos de exemplo...')

  await db.insert(productsTable).values(SAMPLE_PRODUCTS)

  console.log(`✅ ${SAMPLE_PRODUCTS.length} produtos inseridos com sucesso!`)
  console.log('')
  console.log('📋 Produtos criados:')
  SAMPLE_PRODUCTS.forEach((product, index) => {
    console.log(`   ${index + 1}. ${product.name} - R$ ${product.price}`)
  })
}

async function seed() {
  try {
    await seedAdmin()
    await seedProducts()

    console.log('')
    console.log('🎉 Seed concluído com sucesso!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error)
    process.exit(1)
  }
}

seed()
