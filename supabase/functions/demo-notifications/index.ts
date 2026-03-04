import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // CORS Handling
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { email, name, hotelName, time, type } = await req.json()

    if (!email || !name || !time || !type) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400 })
    }

    const isReminder = type === 'reminder'
    const subject = isReminder
      ? `⏰ Reminder: Hotel Demo with ${hotelName}`
      : `✅ Confirmed: Hoteltec Walkthrough with ${name}`

    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
          .header { padding: 48px 40px; text-align: center; border-bottom: 1px solid #f1f5f9; }
          .content { padding: 48px 40px; }
          .footer { padding: 32px; background-color: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9; font-size: 13px; color: #94a3b8; }
          .pill { display: inline-block; padding: 8px 16px; border-radius: 100px; background-color: #eff6ff; color: #3b82f6; font-size: 12px; font-weight: 800; text-transform: uppercase; margin-bottom: 24px; letter-spacing: 0.1em; }
          .title { font-size: 28px; font-weight: 800; color: #0f172a; margin: 0 0 16px; letter-spacing: -0.02em; }
          .desc { font-size: 16px; color: #64748b; line-height: 1.6; margin: 0 0 32px; }
          .card { background-color: #0f172a; border-radius: 20px; padding: 32px; color: #ffffff; }
          .card-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
          .card-value { font-size: 18px; font-weight: 700; margin-bottom: 24px; }
          .btn { display: inline-block; width: 100%; padding: 18px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 16px; text-align: center; font-weight: 700; font-size: 16px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px; font-weight: 800; color: #0f172a;">HotelTec<span style="color: #3b82f6;">.</span></h1>
          </div>
          <div class="content">
            <div class="pill">${isReminder ? 'Reminder' : 'Reservation Confirmed'}</div>
            <h2 class="title">${isReminder ? 'See you soon!' : 'Meeting Confirmed'}</h2>
            <p class="desc">Hi ${name}, we've scheduled a session for <strong>${hotelName}</strong>. We're excited to show you the revenue-driving tools used by world-class hotels.</p>
            
            <div class="card">
              <div class="card-label">Date & Time</div>
              <div class="card-value">${time}</div>
              <div class="card-label">Booking ID</div>
              <div class="card-value" style="margin-bottom: 0; font-family: monospace;">HT-${Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
            </div>
          </div>
          <div class="footer">
            &copy; 2026 Hoteltec.app<br/>Securely delivered by the Hoteltec Automated Concierge
          </div>
        </div>
      </body>
      </html>
    `;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "noreply@hoteltec.app",
        to: [email],
        subject: subject,
        html: htmlTemplate
      })
    })

    const data = await resendRes.json()

    if (resendRes.ok) {
      return new Response(JSON.stringify({ success: true, data: data }), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        status: 200
      })
    } else {
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      })
    }

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    })
  }
})
