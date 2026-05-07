export async function getWeather(location) {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    console.warn("No OPENWEATHERMAP_API_KEY found, using mock weather data for", location);
    return getMockWeather(location);
  }

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Location not found. Please try a valid city.');
      }
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    return {
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      location: data.name
    };
  } catch (error) {
    if (error.message.includes('Location not found')) throw error;
    console.error("Weather fetch failed, falling back to mock:", error);
    return getMockWeather(location);
  }
}

function getMockWeather(location) {
  // Simple mock logic based on location name length for variety
  const isHot = location.length % 2 === 0;
  return {
    temp: isHot ? 32 : 18,
    humidity: isHot ? 40 : 75,
    description: isHot ? "clear sky" : "light rain",
    location: location || "Unknown"
  };
}
