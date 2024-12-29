// app/api/launches/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

// The GET function to handle the API request for fetching launches
export async function GET() {
  try {
    // Fetch data from the SpaceX API
    const response = await axios.get('https://api.spacexdata.com/v3/launches');
    
    // Return the fetched data as JSON response
    return NextResponse.json(response.data);
  } catch (error) {
    // Log the error and return a 500 response
    console.error('Error fetching launches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch launches' },
      { status: 500 }
    );
  }
}
