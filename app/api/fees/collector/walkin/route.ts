import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  let body: { type?: unknown; name?: unknown; phone?: unknown; amount?: unknown; invitedBy?: unknown; category?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

  const { type, name, phone, amount, invitedBy, category } = body

  if (typeof name !== 'string' || typeof amount !== 'number' || typeof type !== 'string') {
    return NextResponse.json({ error: 'name, amount and type required' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const now = new Date()

  if (type === 'new_member') {
    const { data: member, error: memberError } = await supabase.from('members').insert({
      name: name.toUpperCase(),
      phone: typeof phone === 'string' ? phone : `+91 0000 000 ${Date.now() % 1000}`,
      category: typeof category === 'string' ? category : 'Unknown',
      status: 'pending_onboarding',
    }).select().single()

    if (memberError || !member) return NextResponse.json({ error: 'Failed to create member' }, { status: 500 })

    await supabase.from('payments').insert({
      member_id: member.id,
      amount,
      method: 'Cash',
      period_month: now.getMonth() + 1,
      period_year: now.getFullYear(),
      status: 'verified',
      notes: 'New member walk-in',
    })

    return NextResponse.json({ ok: true, type: 'new_member', memberId: member.id })
  }

  if (type === 'visitor') {
    const { data: meeting } = await supabase
      .from('meeting_sessions')
      .select('id')
      .eq('meeting_date', now.toISOString().slice(0, 10))
      .single()

    if (!meeting) return NextResponse.json({ error: 'No meeting scheduled today' }, { status: 404 })

    await supabase.from('visitor_payments').insert({
      visitor_name: name,
      phone: typeof phone === 'string' ? phone : null,
      invited_by: typeof invitedBy === 'string' ? invitedBy : null,
      amount,
      meeting_id: meeting.id,
    })

    return NextResponse.json({ ok: true, type: 'visitor' })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
