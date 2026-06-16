import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { rateLimit } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

// POST /api/contact — save contact form submission.
// Uses the service-role client so the server-side write bypasses RLS.
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  if (rateLimit(`contact:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { name, email, company, phone, service, message, locale } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'name, email, and message are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const cleanName = String(name).slice(0, 120);
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 254);
    const cleanCompany = company ? String(company).slice(0, 120) : null;
    const cleanPhone = phone ? String(phone).slice(0, 40) : null;
    const cleanService = service ? String(service).slice(0, 40) : null;
    const cleanMessage = String(message).slice(0, 2000);
    const cleanLocale = locale === 'id' ? 'id' : 'en';

    const { data, error } = await supabase
      .from('contacts')
      .insert({ name: cleanName, email: cleanEmail, company: cleanCompany, message: cleanMessage })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error, null, 2));
      throw error;
    }

    // Also drop a segmented lead into the sales pipeline so the team can
    // reach out per service line. Best-effort: never fail the submission.
    const { error: leadError } = await supabase.from('leads').insert({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      company: cleanCompany,
      service: cleanService,
      message: cleanMessage,
      source: 'contact-form',
      status: 'new',
      locale: cleanLocale,
    });
    if (leadError) console.error('Lead insert (non-fatal):', leadError.message);

    return NextResponse.json({ success: true, contact: data }, { status: 201 });
  } catch (error: unknown) {
    const errObj = error as Record<string, unknown>;
    console.error('Contact POST error:', JSON.stringify(errObj, null, 2));
    return NextResponse.json(
      { error: 'Failed to save contact', detail: errObj?.message || errObj?.code || String(error) },
      { status: 500 }
    );
  }
}
