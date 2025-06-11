
import { NextResponse, type NextRequest } from 'next/server';
import { query, testDbConnection } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Optional: Test connection explicitly if you want, or just run a query.
    // const isConnected = await testDbConnection();
    // if (!isConnected) {
    //   return NextResponse.json({ error: 'Failed to connect to the database.' }, { status: 500 });
    // }

    const { rows } = await query('SELECT NOW() as now');
    
    return NextResponse.json({ success: true, data: rows[0] }, { status: 200 });
  } catch (error) {
    console.error('API Error in /api/db-test:', error);
    // Avoid sending detailed error messages to the client in production
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: 'Failed to query the database.', details: errorMessage }, { status: 500 });
  }
}
