import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate inputs
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Here you would typically integrate with Resend, SendGrid, or Nodemailer.
    // Example: await resend.emails.send({ ... })
    // For now, we simulate a fast backend response.
    
    // Simulating slight network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Log the message to the server console as proof of backend functionality
    console.log('--- NEW CONTACT FORM SUBMISSION ---');
    console.log(`From: ${name} <${email}>`);
    console.log(`Message: ${message}`);
    console.log('-----------------------------------');

    return NextResponse.json(
      { success: true, message: 'Message sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
