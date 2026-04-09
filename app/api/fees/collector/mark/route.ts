import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let body: { memberId?: unknown; action?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const { memberId, action } = body
  if (typeof memberId !== 'string' || !['paid', 'no_show'].includes(action as string)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const now = new Date()

  if (action === 'paid') {
    await supabase.from('payments').insert({
      member_id: memberId,
      amount: 2500,
      method: 'Cash',
      period_month: now.getMonth() + 1,
      period_year: now.getFullYear(),
      status: 'verified',
      notes: 'Marked by collector',
    })
  }
  // no_show: no DB record, just removes from collector UI client-side

  return NextResponse.json({ ok: true })
}
