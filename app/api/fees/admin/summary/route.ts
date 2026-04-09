import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminPin } from '@/lib/fees/admin-auth'

export async function GET(req: NextRequest) {
  if (!verifyAdminPin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const { data: payments } = await supabase
    .from('payments')
    .select('amount, method, status')
    .eq('period_month', month)
    .eq('period_year', year)

  const { data: members } = await supabase
    .from('members')
    .select('id')
    .eq('status', 'active')

  const verified = payments?.filter(p => p.status === 'verified') || []
  const pending = payments?.filter(p => p.status === 'pending_verification') || []

  return NextResponse.json({
    totalCollected: verified.reduce((s, p) => s + p.amount, 0),
    pendingVerification: pending.length,
    cashPending: verified.filter(p => p.method === 'Cash').length,
    totalMembers: members?.length || 0,
  })
}
