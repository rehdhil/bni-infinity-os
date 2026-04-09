export async function sendEmailOTP(email: string, name: string, otp: string): Promise<void> {
  const webhookUrl = process.env.N8N_OTP_WEBHOOK_URL
  if (!webhookUrl) throw new Error('N8N_OTP_WEBHOOK_URL is not set')
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET ?? '',
    },
    body: JSON.stringify({ email, name, otp }),
  })
  if (!res.ok) throw new Error(`Email OTP send failed: ${res.status}`)
}
