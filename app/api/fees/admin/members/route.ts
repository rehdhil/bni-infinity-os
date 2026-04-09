import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminPin } from '@/lib/fees/admin-auth'

export async function GET(req: NextRequest) {
  if (!verifyAdminPin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const filter = searchParams.get('filter') || 'all'
  const supabase = createServiceClient()
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { data: members } = await supabase
    .from('members')
    .select('id, name, phone, power_team, category')
    .eq('status', 'active')
    .order('name')

  const { data: payments } = await supabase
    .from('payments')
    .select('id, member_id, amount, method, status, created_at, proof_url, transaction_ref')
    .eq('period_month', month)
    .eq('period_year', year)

  const { data: fees } = await supabase
    .from('fees')
    .select('member_id, amount, status, description')
    .eq('status', 'pending')

  const paymentMap = new Map(payments?.map(p => [p.member_id, p]) || [])
  const feesMap = new Map<string, number>()
  fees?.forEach(f => feesMap.set(f.member_id, (feesMap.get(f.member_id) || 0) + f.amount))

  let result = (members || []).map(m => ({
    ...m,
    payment: paymentMap.get(m.id) || null,
    additional_fees: feesMap.get(m.id) || 0,
  }))

  if (filter === 'pending') result = result.filter(m => !m.payment || m.payment.status === 'pending_verification')
  if (filter === 'paid') result = result.filter(m => m.payment?.status === 'verified')
  if (filter === 'cash') result = result.filter(m => m.payment?.method === 'Cash')
  if (filter === 'arrears') result = result.filter(m => m.additional_fees > 0)

  return NextResponse.json(result)
}
