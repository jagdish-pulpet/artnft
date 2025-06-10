
import { type NextRequest, NextResponse } from 'next/server';

const COINMARKETCAP_API_URL = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest';
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

export async function GET(request: NextRequest) {
  // Log to check if the API key is accessible on the server
  if (process.env.COINMARKETCAP_API_KEY) {
    console.log('Server check: COINMARKETCAP_API_KEY is SET.');
  } else {
    console.error('Server check: COINMARKETCAP_API_KEY is NOT SET or undefined.');
  }

  if (!COINMARKETCAP_API_KEY) {
    console.error('Detailed Error: COINMARKETCAP_API_KEY is not configured in the server environment. Ensure it is set in .env.local and the server has been restarted.');
    return NextResponse.json({ error: 'CoinMarketCap API key is not configured.' }, { status: 500 });
  }

  const { searchParams } = request.nextUrl;
  const start = searchParams.get('start') || '1';
  const limit = searchParams.get('limit') || '20'; // Default limit

  try {
    const response = await fetch(`${COINMARKETCAP_API_URL}?start=${start}&limit=${limit}&sort=market_cap`, {
      headers: {
        'X-CMC_PRO_API_KEY': COINMARKETCAP_API_KEY,
        'Accept': 'application/json',
      },
      // Revalidate data every 5 minutes (300 seconds) for each specific query
      next: { revalidate: 300 } 
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('CoinMarketCap API Error:', errorData);
      return NextResponse.json({ error: `Failed to fetch data from CoinMarketCap: ${errorData?.status?.error_message || response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    
    const transformedData = data.data.map((coin: any) => ({
      id: coin.id.toString(),
      name: coin.name,
      symbol: coin.symbol,
      logoUrl: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`,
      price: coin.quote.USD.price,
      change24h: coin.quote.USD.percent_change_24h,
      marketCap: coin.quote.USD.market_cap,
    }));
    
    // Return the data and a flag indicating if there might be more items
    // Assuming that if we get fewer items than requested limit, there are no more.
    // This is a simple way; a more robust API might return total_count.
    const hasMore = transformedData.length === parseInt(limit);

    return NextResponse.json({ data: transformedData, hasMore });
  } catch (error) {
    console.error('Error fetching crypto stats:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
