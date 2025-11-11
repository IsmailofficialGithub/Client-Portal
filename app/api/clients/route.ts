import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import nodemailer from 'nodemailer';
import { CreateClientInput, ApiResponse, Client } from '@/types/client';

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// GET - Fetch all clients
export async function GET() {
  const { data: clients, error } = await supabaseAdmin
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json<ApiResponse<Client[]>>({
    success: true,
    data: clients,
  });
}

// POST - Create new client and send email
export async function POST(request: NextRequest) {
  const body: CreateClientInput = await request.json();
  
  const { name, email, business_name } = body;

  // Validate input
  if (!name || !email || !business_name) {
    return NextResponse.json<ApiResponse>(
      { success: false, message: 'All fields are required' },
      { status: 400 }
    );
  }

  // Insert client into database
  const { data: client, error: dbError } = await supabaseAdmin
    .from('clients')
    .insert([{ name, email, business_name }])
    .select()
    .single();

  if (dbError) {
    return NextResponse.json<ApiResponse>(
      { 
        success: false, 
        message: dbError.message.includes('duplicate') 
          ? 'Email already exists' 
          : dbError.message 
      },
      { status: 400 }
    );
  }

  // Send welcome email via Nodemailer
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Accountancy Firm <noreply@company.com>',
      to: email,
      subject: 'Welcome to Our Accountancy Services',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome Aboard! 🎉</h1>
              </div>
              <div class="content">
                <h2>Hi ${name},</h2>
                <p>We're thrilled to have <strong>${business_name}</strong> join our family of clients!</p>
                <p>Our team is dedicated to providing you with exceptional accounting services tailored to your business needs.</p>
                
                <h3>What's Next?</h3>
                <ul>
                  <li>Your dedicated account manager will reach out within 24 hours</li>
                  <li>We'll schedule an onboarding call to understand your needs</li>
                  <li>You'll receive access to our client portal shortly</li>
                </ul>
                
                <p>If you have any immediate questions, feel free to reply to this email.</p>
                
                <a href="#" class="button">Access Client Portal</a>
                
                <p style="margin-top: 30px;">Best regards,<br><strong>Your Accountancy Team</strong></p>
              </div>
              <div class="footer">
                <p>© 2025 Accountancy Firm. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });
  } catch (emailError) {
    console.error('Email sending failed:', emailError);
    // Still return success since client was added to database
  }

  return NextResponse.json<ApiResponse<Client>>({
    success: true,
    data: client,
    message: 'Client added successfully and welcome email sent!',
  });
}