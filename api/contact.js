import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';

const RATE_LIMIT = 5; // submissions per IP...
const RATE_WINDOW_MS = 10 * 60 * 1000; // ...per 10 minutes
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const json = (res, status, body) => res.status(status).json(body);

async function sendEmail(payload) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { ok: false, error: 'Method not allowed' });
  }

  const {
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY,
    CONTACT_TO_EMAIL,
    CONTACT_FROM_EMAIL = 'Krish Patel <onboarding@resend.dev>',
    AUTOREPLY_ENABLED,
  } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY || !CONTACT_TO_EMAIL) {
    console.error('contact: missing environment variables');
    return json(res, 500, { ok: false, error: 'Server is not configured' });
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body || {};

  // Honeypot: real users never fill this hidden field. Pretend success to bots.
  if (body.website) return json(res, 200, { ok: true });

  // The footer form only collects an email, so it gets a default name and message.
  const fromFooter = body.source === 'footer';
  const name = String(body.name ?? '').trim() || (fromFooter ? 'Website visitor' : '');
  const email = String(body.email ?? '').trim();
  const message =
    String(body.message ?? '').trim() ||
    (fromFooter ? 'Would like to connect (sent from the footer form).' : '');

  if (!name || name.length > 100) return json(res, 400, { ok: false, error: 'Please enter a valid name.' });
  if (!EMAIL_RE.test(email) || email.length > 254) return json(res, 400, { ok: false, error: 'Please enter a valid email.' });
  if (!message || message.length > 2000) return json(res, 400, { ok: false, error: 'Message must be 1-2000 characters.' });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const ipHash = createHash('sha256').update(`${ip}:${SUPABASE_URL}`).digest('hex').slice(0, 32);
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 300);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

  // Rate limit using stored submissions (works across stateless serverless instances).
  const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
  const { count } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', ipHash)
    .gte('created_at', since);
  if ((count ?? 0) >= RATE_LIMIT) {
    return json(res, 429, { ok: false, error: 'Too many messages. Please try again in a few minutes.' });
  }

  const { data: row, error: dbError } = await supabase
    .from('contact_messages')
    .insert({ name, email, message, ip_hash: ipHash, user_agent: userAgent })
    .select('id')
    .single();
  if (dbError) {
    console.error('contact: db insert failed', dbError);
    return json(res, 500, { ok: false, error: 'Could not save your message.' });
  }

  // Notification to the site owner. Reply-To is the visitor so "Reply" just works.
  try {
    await sendEmail({
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `New portfolio enquiry from ${name.replace(/[\r\n]+/g, ' ')}`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
        <p><strong>Name:</strong> ${escapeHtml(name)}<br><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p style="white-space:pre-wrap;border-left:3px solid #ddd;padding-left:12px">${escapeHtml(message)}</p>
      </div>`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });
    await supabase.from('contact_messages').update({ email_sent: true }).eq('id', row.id);
  } catch (err) {
    // Message is already safely stored; don't fail the visitor's submission.
    console.error('contact: notification email failed', err);
  }

  // Optional auto-reply. Needs a Resend-verified sending domain.
  if (AUTOREPLY_ENABLED === 'true') {
    try {
      await sendEmail({
        from: CONTACT_FROM_EMAIL,
        to: email,
        reply_to: CONTACT_TO_EMAIL,
        subject: 'Thanks for reaching out - Krish Patel',
        html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#111">
          <p>Hi ${fromFooter ? 'there' : escapeHtml(name)},</p>
          <p>Thanks for getting in touch. I've received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>Krish Patel<br>Full Stack Developer</p>
        </div>`,
        text: `Hi ${name},\n\nThanks for getting in touch. I've received your message and will get back to you as soon as possible.\n\nBest regards,\nKrish Patel\nFull Stack Developer`,
      });
    } catch (err) {
      console.error('contact: auto-reply failed', err);
    }
  }

  return json(res, 200, { ok: true });
}

function safeParse(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
