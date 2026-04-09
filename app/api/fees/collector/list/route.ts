import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyCollectorPin } from '@/lib/fees/collector-auth'

export async function GET(req: NextRequest) {
  if (!verifyCollectorPin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServiceClient()
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { data: members } = await supabase
    .from('members')
    .select('id, name, power_team, phone')
    .eq('status', 'active')
    .order('name')

  if (!members) return NextResponse.json([])

  const { data: payments } = await supabase
    .from('payments')
    .select('member_id, method, status, amount')
    .eq('period_month', month)
    .eq('period_year', year)

  const { data: plans } = await supabase
    .from('payment_plans')
    .select('member_id')
    .eq('active', true)
    .lte('term_start', now.toISOString().slice(0, 10))
    .gte('term_end', now.toISOString().slice(0, 10))

  const paidPlanMemberIds = new Set(plans?.map(p => p.member_id) || [])
  const paymentMap = new Map(payments?.map(p => [p.member_id, p]) || [])

  const pending = members
    .filter(m => !paidPlanMemberIds.has(m.id)) // term plan members never owe
    .map(m => {
      const p = paymentMap.get(m.id)
      return {
        id: m.id,
        name: m.name,
        power_team: m.power_team,
        phone: m.phone,
        payment_status: p?.status || 'unpaid',
        payment_method: p?.method || null,
      }
    })
    .filter(m =>
      m.payment_status === 'unpaid' ||
      (m.payment_method === 'Cash' && m.payment_status !== 'verified')
    )

  return NextResponse.json(pending)
}
