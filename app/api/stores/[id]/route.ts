import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth, requireStoreOwnership, handleAuthError } from '@/lib/middleware'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth()
    await requireStoreOwnership(params.id, userId)

    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json({ error: 'Store name is required' }, { status: 400 })
    }

    const store = await prisma.store.update({
      where: { id: params.id },
      data: { name: name.trim() },
      select: { id: true, name: true, createdAt: true },
    })

    return NextResponse.json(store)
  } catch (error) {
    return handleAuthError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth()
    await requireStoreOwnership(params.id, userId)

    await prisma.store.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleAuthError(error)
  }
}
