import { NextRequest, NextResponse } from 'next/server'
import { storeService } from '@/services/store.service'
import { updateStoreSchema } from '@/validators/store.validator'
import { requireAuth, requireStoreOwnership, handleAuthError } from '@/lib/middleware'
import { ZodError } from 'zod'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth()
    await requireStoreOwnership(params.id, userId)

    const body = await request.json()
    const validatedData = updateStoreSchema.parse(body)

    const store = await storeService.updateStore(params.id, validatedData)
    return NextResponse.json(store)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }
    return handleAuthError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth()
    await requireStoreOwnership(params.id, userId)

    await storeService.deleteStore(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return handleAuthError(error)
  }
}
