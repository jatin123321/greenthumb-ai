import { NextResponse } from 'next/server';
import { getWeather } from '@/lib/services/weather';
import { recommendPlants } from '@/lib/services/plants';

export async function POST(request) {
  try {
    const body = await request.json();
    const { location, space, size } = body;

    if (!location || !space || !size) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Fetch local climate data using the location
    const weatherData = await getWeather(location);

    // Get tailored plant recommendations
    const recommendedPlants = recommendPlants({
      temp: weatherData.temp,
      space,
      size
    });

    return NextResponse.json({
      success: true,
      weather: weatherData,
      plants: recommendedPlants
    });

  } catch (error) {
    console.error('Recommendation API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error while fetching recommendations.' },
      { status: 500 }
    );
  }
}
