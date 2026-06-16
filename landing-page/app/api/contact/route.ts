import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, practiceName, interest, leads, message,phone,email } = body;

    const { data, error } = await resend.emails.send({
      from: 'Fusion AI <onboarding@resend.dev>', 
      to: ['hello@fusionaiagency.com'], 
      subject: `🔥 New Strategy Request: ${practiceName}`,
      html: `
        <h2>New High-Intent Lead</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Practice:</strong> ${practiceName}</p>
        <p><strong>Interest:</strong> ${interest}</p>
        <p><strong>Monthly Leads:</strong> ${leads}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}