import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminPin } from '@/lib/fees/admin-auth'

export async function POST(req: NextRequest) {
  if (!verifyAdminPin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { paymentId?: unknown; action?: unknown; notes?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const { paymentId, action, notes } = body

  if (typeof paymentId !== 'string' || !['verified', 'rejected'].includes(action as string)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: updated, error: updateError } = await supabase.from('payments')
    .update({ status: action as string, notes: typeof notes === 'string' ? notes : null })
    .eq('id', paymentId)
    .select('id')
    .single()

  if (updateError || !updated) {
    return NextResponse.json({ error: 'Payment not found or update failed' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
