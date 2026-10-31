import { NextRequest, NextResponse } from 'next/server';
import { validateContactForm, ContactPayload } from '@/src/lib/arrakis-logic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactPayload;
    const validation = validateContactForm(body);

    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed. Please check required fields.',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Message received by ARRAKIS server endpoint. Souvik Ghosh will get back to you soon.',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request payload.',
      },
      { status: 400 }
    );
  }
}
