import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyCollectorPin } from '@/lib/fees/collector-auth'

// UI label → DB constraint value
const METHOD_MAP: Record<string, string> = {
  Cash: 'Cash',
  UPI: 'UPI',
  Card: 'CC',
}

export async function POST(req: NextRequest) {
  if (!verifyCollectorPin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let memberId: string, action: string, amount: number, method: string
  let proofUrl: string | null = null

  const contentType = req.headers.get('content-type') ?? ''

  if (contentType.includes('multipart/form-data')) {
    let form: FormData
    try { form = await req.formData() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }

    memberId = (form.get('memberId') as string) ?? ''
    action   = (form.get('action')   as string) ?? ''
    amount   = Number(form.get('amount'))   || 2500
    method   = (form.get('method')   as string) ?? 'Cash'

    const proof = form.get('proof') as File | null
    if (proof && proof.size > 0) {
      const supabase = createServiceClient()
      const ext = proof.name.split('.').pop() ?? 'jpg'
      const path = `collector/${memberId}/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage
        .from('payment-proofs')
        .upload(path, proof, { contentType: proof.type, upsert: false })

      if (!uploadErr) {
        const { data } = supabase.storage.from('payment-proofs').getPublicUrl(path)
        proofUrl = data.publicUrl
      }
    }
  } else {
    // JSON fallback (no proof)
    let body: { memberId?: unknown; action?: unknown; amount?: unknown; method?: unknown }
    try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }) }
    memberId = (body.memberId as string) ?? ''
    action   = (body.action   as string) ?? ''
    amount   = typeof body.amount === 'number' && body.amount > 0 ? body.amount : 2500
    method   = (body.method   as string) ?? 'Cash'
  }

  if (!memberId || !['paid', 'no_show'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const resolvedMethod = METHOD_MAP[method] ?? 'Cash'
  const supabase = createServiceClient()
  const now = new Date()

  if (action === 'paid') {
    const { data: existing } = await supabase
      .from('payments')
      .select('id')
      .eq('member_id', memberId)
      .eq('period_month', now.getMonth() + 1)
      .eq('period_year', now.getFullYear())
      .limit(1)
      .single()

    if (existing) {
      return NextResponse.json({ ok: true, alreadyPaid: true })
    }

    await supabase.from('payments').insert({
      member_id: memberId,
      amount,
      method: resolvedMethod,
      proof_url: proofUrl,
      period_month: now.getMonth() + 1,
      period_year: now.getFullYear(),
      status: 'verified',
      notes: 'Marked by collector',
    })
  }
  // no_show: no DB record, removed client-side

  return NextResponse.json({ ok: true })
}
