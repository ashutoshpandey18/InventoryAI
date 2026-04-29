#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function setupTestUser() {
  console.log('🔍 Checking for existing test users...\n')

  // Check for existing users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  console.log(`Found ${users.length} user(s) in the database:\n`)
  users.forEach((user) => {
    console.log(`  - ${user.email} (${user.name}) - ${user.role}`)
  })

  // Create a test user if none exist
  if (users.length === 0) {
    console.log('\n📝 Creating test user...')

    const hashedPassword = await bcrypt.hash('password123', 12)

    const testUser = await prisma.user.create({
      data: {
        email: 'test@inventory.ai',
        name: 'Test User',
        password: hashedPassword,
        role: 'ADMIN',
      },
    })

    console.log('✅ Test user created successfully!')
    console.log('\nLogin credentials:')
    console.log(`  Email: test@inventory.ai`)
    console.log(`  Password: password123`)
  } else {
    console.log('\n💡 You can use any of the above users to login.')
    console.log('   If you forgot the password, you can reset it in Prisma Studio.')
    console.log('   Prisma Studio: http://localhost:5555')
  }

  console.log('\n✨ Setup complete!\n')
}

setupTestUser()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
