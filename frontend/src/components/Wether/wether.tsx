import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Cloud, Droplets } from "lucide-react";
import Navbar from "../Navbar";

const statesOfIndia = ["Chhattisgarh"];

// Function to generate random weather data for the next 30 days
const generateRandomWeatherData = () => {
  const weatherConditions = [
    "Sunny",
    "Cloudy",
    "Rainy",
    "Stormy",
    "Drizzle",
    "Thunderstorm",
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1); // Start from tomorrow

    return {
      date: date.toISOString().split("T")[0], // Format: YYYY-MM-DD
      current_weather:
        weatherConditions[Math.floor(Math.random() * weatherConditions.length)],
      rainfall_mm: parseFloat((Math.random() * 50).toFixed(1)), // Random rainfall between 0 and 50mm
    };
  });
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { date, rainfall_mm, current_weather } = payload[0].payload;
    return (
      <div className="bg-card p-3 border rounded shadow-lg text-card-foreground">
        <p className="font-semibold">{date}</p>
        <p className="flex items-center">
          <Droplets className="w-4 h-4 mr-1 text-blue-500" /> Rainfall:{" "}
          {rainfall_mm} mm
        </p>
        <p className="flex items-center">
          <Cloud className="w-4 h-4 mr-1 text-gray-400" /> Condition:{" "}
          {current_weather}
        </p>
      </div>
    );
  }
  return null;
};

const WeatherDashboard = () => {
  const [selectedState, setSelectedState] = useState(statesOfIndia[0]);
  const [rainfallData, setRainfallData] = useState(generateRandomWeatherData());

  // Handle state selection change
  const handleStateChange = (value) => {
    setSelectedState(value);
    setRainfallData(generateRandomWeatherData());
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="container mx-auto px-4 py-24 max-w-7xl">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">
              Weather & Rainfall Analysis
            </h1>
            <p className="text-muted-foreground mt-2">
              Monitor rainfall patterns to plan your agricultural activities
              effectively.
            </p>
          </div>

          <Card className="border border-border/40 bg-background/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl font-medium">
                Rainfall Data for {selectedState} (Next 30 Days)
              </CardTitle>
              <div className="w-64">
                <Select value={selectedState} onValueChange={handleStateChange}>
                  <SelectTrigger className="border-border/40">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {statesOfIndia.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rainfallData}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                    />
                    <YAxis
                      label={{
                        value: "Rainfall (mm)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <Line
                      type="monotone"
                      dataKey="rainfall_mm"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <Card className="border border-border/40 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Weather Impact on Crops</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Understanding rainfall patterns helps in planning irrigation,
                  selecting appropriate crop varieties, and determining planting
                  schedules. Excess or insufficient rainfall can significantly
                  impact crop yields and quality.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Rainfall Requirements:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Rice: 150-300 cm annually</li>
                    <li>Wheat: 60-100 cm annually</li>
                    <li>Maize: 50-80 cm annually</li>
                    <li>Pulses: 45-65 cm annually</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-background/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Seasonal Forecasts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Seasonal forecasts provide valuable insights for agricultural
                  planning. Monitor these trends to make informed decisions for
                  your farming activities.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Cloud className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Monsoon Season (June-September)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Expected to be normal to above normal across most
                        regions.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-full">
                      <Droplets className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">
                        Winter Season (October-February)
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Predicted to have moderate rainfall in northern and
                        central regions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherDashboard;
