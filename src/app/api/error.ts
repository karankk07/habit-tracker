import { NextResponse } from 'next/server'

export function GET() {
  return new NextResponse(
    JSON.stringify({ message: 'Internal Server Error' }),
    {
      status: 500,
      headers: {
        'content-type': 'application/json',
      },
    }
  )
} 