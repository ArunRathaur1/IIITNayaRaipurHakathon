import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, CloudRain, Sun, Sunrise, Sunset } from 'lucide-react';

interface WeatherData {
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  time: string[];
}

interface ForecastData {
  daily: WeatherData;
  latitude: number;
  longitude: number;
}

interface GeoLocation {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
}

const Weather = () => {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [geoLocation, setGeoLocation] = useState<GeoLocation>({
    latitude: null,
    longitude: null,
    city: null,
    country: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getGeoLocation = (): Promise<GeoLocation> => {
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              
              // Fetch city and country based on coordinates
              axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
                .then(response => {
                  const address = response.data.address;
                  const city = address.city || address.town || address.village || 'Unknown City';
                  const country = address.country || 'Unknown Country';
                  
                  resolve({ latitude, longitude, city, country });
                })
                .catch(err => {
                  console.error("Error fetching location details:", err);
                  resolve({ latitude, longitude, city: 'Unknown City', country: 'Unknown Country' });
                });
            },
            (error) => {
              console.error("Error getting location:", error);
              reject(error);
            }
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      });
    };

    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);
      try {
        const location = await getGeoLocation();
        setGeoLocation(location);
        
        const weatherApiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
        const response = await axios.get(weatherApiUrl);
        setForecast(response.data);
      } catch (err: any) {
        setError(err.message || "Could not fetch weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  const CustomTooltip = ({ active, payload }: { active: boolean; payload: any[] }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-card p-2 border border-border rounded shadow-sm">
        <p className="label text-sm">{`${payload[0].name} : ${payload[0].value}°C`}</p>
      </div>
    );
  }
  return null;
};

  if (loading) {
    return <Card className="w-full p-4 border-border/40 shadow-lg bg-card/80 backdrop-blur-sm"><CardContent>Loading weather data...</CardContent></Card>;
  }

  if (error) {
    return <Card className="w-full p-4 border-destructive/40 shadow-lg bg-card/80 backdrop-blur-sm"><CardContent>Error: {error}</CardContent></Card>;
  }

  if (!forecast || !geoLocation.latitude || !geoLocation.longitude) {
    return <Card className="w-full p-4 border-border/40 shadow-lg bg-card/80 backdrop-blur-sm"><CardContent>No weather data available.</CardContent></Card>;
  }

  const dailyData = forecast.daily;
  const forecastDays = dailyData.time.map((time, index) => {
    const date = new Date(time);
    return {
      time: `${date.toLocaleDateString()}`,
      max: dailyData.temperature_2m_max[index],
      min: dailyData.temperature_2m_min[index],
      precipitation: dailyData.precipitation_sum[index],
    };
  });

  return (
    <Card className="w-full border-border/40 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            Weather Forecast
            {geoLocation.city && geoLocation.country && (
              <div className="text-sm text-muted-foreground">
                {geoLocation.city}, {geoLocation.country}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {forecastDays[0].precipitation > 1 ? <CloudRain size={20} /> : <Sun size={20} />}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={forecastDays} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="max" stroke="#ff7300" name="Max Temp" />
            <Line type="monotone" dataKey="min" stroke="#387908" name="Min Temp" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Weather;
