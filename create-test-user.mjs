#!/usr/bin/env node
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function createTestUserWithPassword() {
  console.log('🔐 Creating a test user with password...\n')

  const email = 'admin@inventory.ai'
  const password = 'admin123'
  const name = 'Admin User'

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.log(`⚠️  User ${email} already exists!`)
      console.log('   Updating password...\n')

      const hashedPassword = await bcrypt.hash(password, 12)

      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      })

      console.log('✅ Password updated successfully!\n')
    } else {
      console.log('📝 Creating new user...\n')

      const hashedPassword = await bcrypt.hash(password, 12)

      await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
          role: 'OWNER',
        },
      })

      console.log('✅ User created successfully!\n')
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🔑 LOGIN CREDENTIALS')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`   Email:    ${email}`)
    console.log(`   Password: ${password}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
    console.log('🌐 Login URL: http://localhost:3000/signin\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

createTestUserWithPassword()
  .then(() => {
    console.log('✨ Done!\n')
  })
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
