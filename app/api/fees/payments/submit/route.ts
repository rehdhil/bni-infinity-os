import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServiceClient } from '@/lib/supabase/server'
import { getSession } from '@/lib/fees/session'
import { isTermStart } from '@/lib/fees/plans'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const session = await getSession(cookieStore.get('bni_session')?.value)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const amount = parseInt(formData.get('amount') as string)
  const method = formData.get('method') as string
  const transactionRef = formData.get('transaction_ref') as string | null
  const proofFile = formData.get('proof') as File | null

  if (!amount || !['UPI', 'Cash', 'CC', 'Barter'].includes(method)) {
    return NextResponse.json({ error: 'Amount and valid method required' }, { status: 400 })
  }

  if (![2500, 14500].includes(amount)) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  if ((method === 'UPI' || method === 'CC') && !proofFile) {
    return NextResponse.json({ error: 'Proof required for UPI/CC payments' }, { status: 400 })
  }

  if (proofFile) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(proofFile.type)) {
      return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or PDF.' }, { status: 400 })
    }
  }

  const supabase = createServiceClient()
  const now = new Date()

  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('member_id', session.memberId)
    .eq('period_month', now.getMonth() + 1)
    .eq('period_year', now.getFullYear())
    .limit(1)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Payment already submitted for this month' }, { status: 409 })
  }

  let proofUrl: string | null = null

  if (proofFile) {
    const ext = proofFile.name.split('.').pop()
    const path = `${session.memberId}/${now.getFullYear()}-${now.getMonth() + 1}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('payment-proofs')
      .upload(path, proofFile, { contentType: proofFile.type })

    if (uploadError) return NextResponse.json({ error: 'File upload failed' }, { status: 500 })
    proofUrl = path
  }

  const is6Month = amount === 14500 && isTermStart(now)

  const { data: payment, error: insertError } = await supabase.from('payments').insert({
    member_id: session.memberId,
    amount,
    method,
    transaction_ref: transactionRef || null,
    proof_url: proofUrl,
    period_month: now.getMonth() + 1,
    period_year: now.getFullYear(),
    status: method === 'Cash' ? 'verified' : 'pending_verification',
    notes: is6Month ? '6-month advance payment' : null,
  }).select().single()

  if (insertError || !payment) return NextResponse.json({ error: 'Payment record failed' }, { status: 500 })

  if (is6Month) {
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    const termStart = month === 4 ? `${year}-04-01` : `${year}-10-01`
    const termEnd = month === 4 ? `${year}-09-30` : `${year + 1}-03-31`

    await supabase.from('payment_plans').insert({
      member_id: session.memberId,
      plan_type: '6month',
      term_start: termStart,
      term_end: termEnd,
      amount_paid: 14500,
      discount: 500,
    })
  }

  return NextResponse.json({ ok: true, paymentId: payment.id, is6Month })
}
