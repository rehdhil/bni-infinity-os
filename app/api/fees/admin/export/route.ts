import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyAdminPin } from '@/lib/fees/admin-auth'

export async function GET(req: NextRequest) {
  if (!verifyAdminPin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const now = new Date()

  const { data } = await supabase
    .from('payments')
    .select(`
      id, amount, method, status, transaction_ref, period_month, period_year, created_at,
      members(name, phone, power_team, category)
    `)
    .order('created_at', { ascending: false })

  const rows = (data || []).map(p => {
    const raw = p.members as unknown
    const member = (Array.isArray(raw) ? raw[0] : raw) as { name: string; phone: string; power_team: string; category: string } | null
    return {
      Name: member?.name || '',
      Phone: member?.phone || '',
      Power_Team: member?.power_team || '',
      Category: member?.category || '',
      Amount: p.amount,
      Method: p.method,
      Status: p.status,
      Reference: p.transaction_ref || '',
      Month: `${p.period_month}/${p.period_year}`,
      Submitted_At: new Date(p.created_at).toLocaleString('en-IN'),
    }
  })

  if (rows.length === 0) {
    return new NextResponse('No data', {
      headers: { 'Content-Type': 'text/csv' },
    })
  }

  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => {
      const val = String((r as Record<string, unknown>)[h] ?? '')
      return `"${val.replace(/"/g, '""')}"`
    }).join(',')),
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="bni-payments-${now.toISOString().slice(0, 10)}.csv"`,
    },
  })
}
