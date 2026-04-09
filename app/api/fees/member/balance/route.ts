import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/fees/session'
import { calculateBalance } from '@/lib/fees/balance'

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('bni_session')?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()

  const { data: balanceRow } = await supabase
    .from('member_balance')
    .select('*')
    .eq('id', session.memberId)
    .single()

  if (!balanceRow) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

  // Count offline meetings up to today that have no verified payment
  const { data: meetings } = await supabase
    .from('meeting_sessions')
    .select('id, meeting_date')
    .eq('type', 'offline')
    .lte('meeting_date', new Date().toISOString().slice(0, 10))

  const { data: verifiedPayments } = await supabase
    .from('payments')
    .select('period_month, period_year')
    .eq('member_id', session.memberId)
    .eq('status', 'verified')

  const paidMonths = new Set(
    (verifiedPayments || []).map(p => `${p.period_year}-${p.period_month}`)
  )

  const unpaidMeetings = (meetings || []).filter(m => {
    const d = new Date(m.meeting_date)
    return !paidMonths.has(`${d.getFullYear()}-${d.getMonth() + 1}`)
  })

  const totalDue = calculateBalance({
    unpaidMeetings: balanceRow.has_term_plan ? 0 : unpaidMeetings.length,
    unpaidFees: balanceRow.unpaid_fees,
    hasTermPlan: balanceRow.has_term_plan,
    monthlyRate: 2500,
  })

  const { data: history } = await supabase
    .from('payments')
    .select('id, amount, method, period_month, period_year, status, created_at')
    .eq('member_id', session.memberId)
    .order('created_at', { ascending: false })
    .limit(10)

  return NextResponse.json({
    name: balanceRow.name,
    totalDue,
    unpaidMeetings: unpaidMeetings.length,
    unpaidFees: balanceRow.unpaid_fees,
    hasTermPlan: balanceRow.has_term_plan,
    history: history || [],
  })
}
