export async function sendWhatsAppOTP(phone: string, otp: string): Promise<void> {
  const phoneId = process.env.WHATSAPP_PHONE_ID!
  const token = process.env.WHATSAPP_TOKEN!

  // Normalise phone: strip spaces (phone is stored as '+91 XXXX XXX XXX' in DB)
  const to = phone.replace(/\s/g, '')

  const res = await fetch(
    `https://graph.facebook.com/v20.0/${phoneId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to,
        type: 'template',
        template: {
          name: 'otp_login',
          language: { code: 'en_US' },
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: otp }],
            },
          ],
        },
      }),
    }
  )

  if (!res.ok) {
    const body = await res.json()
    throw new Error(`WhatsApp send failed: ${JSON.stringify(body)}`)
  }
}
