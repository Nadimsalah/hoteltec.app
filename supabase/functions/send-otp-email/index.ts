import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            }
        })
    }

    try {
        const { email, otp } = await req.json()

        if (!email || !otp) {
            return new Response(JSON.stringify({ error: "Email and OTP are required" }), { status: 400 })
        }

        const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Your Hoteltec Verification Code</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 60px 0;">
          <tr><td align="center">
            <table width="500" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
              <tr><td style="padding: 40px; text-align: center;">
                <h1 style="margin: 0; font-size: 36px; font-weight: 800; color: #0f172a;">HotelTec<span style="color: #3b82f6;">.</span></h1>
              </td></tr>
              <tr><td style="padding: 10px 40px 40px; text-align: center;">
                <h2 style="margin: 0 0 16px; font-size: 24px; color: #0f172a;">Your Secure Login Code</h2>
                <p style="margin: 0 0 32px; color: #475569;">Use the following 4-digit verification code to securely sign in to your Hoteltec account.</p>
                <div style="background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                  <h1 style="margin: 0; font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #0f172a;">${otp}</h1>
                </div>
                <p style="font-size: 14px; color: #64748b;">This code expires in 10 minutes.<br/>If you didn't request this code, you can safely ignore this email.</p>
              </td></tr>
              <tr><td style="padding: 24px 40px; background-color: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 13px; color: #94a3b8;">Securely delivered by Hoteltec API<br/>&copy; 2026 Hoteltec.app</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;

        const resendReq = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: "noreply@hoteltec.app",
                to: [email],
                subject: "Your Hoteltec Verification Code",
                html: htmlTemplate
            })
        })

        const resendData = await resendReq.json()

        if (resendReq.ok) {
            return new Response(JSON.stringify({ success: true, data: resendData }), {
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            })
        } else {
            return new Response(JSON.stringify({ error: resendData }), {
                status: 400,
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
            })
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
})
