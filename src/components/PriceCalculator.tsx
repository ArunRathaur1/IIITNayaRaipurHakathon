import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // For loading effect

const SimpleForm = () => {
  const [formData, setFormData] = useState({
    cropType: "",
    landArea: "",
    waterAvailability: "",
    soilType: "",
    fertilizerType: "",
    additionalInfo: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const placeholders = {
    cropType: "e.g., Wheat, Rice, Corn",
    landArea: "e.g., 5 acres",
    waterAvailability: "e.g., 5000 liters per day",
    soilType: "e.g., Sandy, Clay, Loamy",
    fertilizerType: "e.g., Urea, NPK, Compost",
    additionalInfo: "Any other relevant details...",
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/ai/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data:formData
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError("Failed to fetch estimation. Please try again.");
      }
    } catch (err) {
      setError("Error connecting to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      <Card className="w-full max-w-md p-4 shadow-md">
        <CardHeader>
          <CardTitle>Crop Yield Estimation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.keys(formData).map((field) => (
              <div key={field} className="space-y-2">
                <Label htmlFor={field}>
                  {field.replace(/([A-Z])/g, " $1").trim()}
                </Label>
                <Input
                  id={field}
                  name={field}
                  type="text"
                  placeholder={placeholders[field]}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}
            <Button type="submit" className="w-full">
              Estimate
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Display Loading State */}
      {loading && (
        <div className="w-full max-w-md mt-4 p-4">
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {/* Display Error Message */}
      {error && (
        <Card className="w-full max-w-md mt-4 p-4 text-red-600 bg-red-100 border border-red-400">
          {error}
        </Card>
      )}

      {/* Display AI Response */}
      {result && (
        <Card className="w-full max-w-md mt-4 p-4 shadow-md">
          <CardHeader>
            <CardTitle>Estimation Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>Estimated Yield:</strong> {result.Estimated_yield}
              </p>
              <p>
                <strong>Water Required:</strong> {result.Water_required}
              </p>
              <p>
                <strong>Diseases:</strong> {result.Diseases}
              </p>
              <p>
                <strong>Fertilizer Recommendation:</strong> {result.Fertilizer}
              </p>
              <p>
                <strong>Remark:</strong> {result.Remark}
              </p>
              <p>
                <strong>Estimated Sales:</strong> {result.Estimated_Sales}
              </p>
              <p>
                <strong>Estimated Cost:</strong> {result.Estimated_cost}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleForm;
