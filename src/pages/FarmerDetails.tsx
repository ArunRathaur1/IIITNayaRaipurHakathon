import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CropDataTable from "../components/CropDataTable";

interface Farmer {
  _id: string;
  name: string;
  area: string;
  landArea: number;
  phone: string;
  email: string;
  selectedCrop: string;
  date: string;
}

interface CropStage {
  name: string;
  day: number;
}

interface WaterSchedule {
  day: number;
  amount: string;
}

interface FertilizerSchedule {
  day: number;
  type: string;
  amount: string;
}

interface CropData {
  duration: string;
  waterSchedule: WaterSchedule[];
  fertilizerSchedule: FertilizerSchedule[];
  stages: CropStage[];
}

interface Event {
  day: number;
  date?: Date;
  type: string;
  details: string;
}

const FarmerDetails: React.FC = () => {
  const { phone } = useParams<{ phone: string }>();
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [newCrop, setNewCrop] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);
  const [apiCropData, setApiCropData] = useState<CropData | null>(null);
  const [loadingCropData, setLoadingCropData] = useState<boolean>(false);

  useEffect(() => {
    const fetchFarmer = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/farmers/phone/${phone}`
        );
        setFarmer(response.data);

        // If farmer has a selected crop, fetch its data
        if (response.data.selectedCrop) {
          fetchCropData(response.data.selectedCrop);
        }
      } catch (err: unknown) {
        setError("Farmer not found");
        toast({
          title: "Error",
          description: "Could not find farmer details with this phone number",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchFarmer();
  }, [phone]);

  const fetchCropData = async (cropName: string) => {
    try {
      setLoadingCropData(true);
      const response = await axios.post(
        "http://localhost:5000/api/ai/crop_data",
        {
          crop: cropName,
        }
      );

      if (response.data.success) {
        setApiCropData(response.data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch crop data",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error fetching crop data:", err);
      toast({
        title: "Error",
        description: "Could not fetch crop data from the AI API",
        variant: "destructive",
      });
    } finally {
      setLoadingCropData(false);
    }
  };

  const handleUpdateCrop = async () => {
    if (!newCrop.trim() || !farmer) return;
    try {
      setUpdating(true);
      const response = await axios.patch(
        `http://localhost:5000/api/farmers/${farmer._id}/crop`,
        {
          selectedCrop: newCrop,
        }
      );
      setFarmer(response.data.farmer);

      // Fetch the data for the new crop
      fetchCropData(newCrop);

      setNewCrop("");
      toast({
        title: "Crop Updated",
        description: `Successfully updated crop to ${newCrop}`,
      });
    } catch (error) {
      console.error("Error updating crop", error);
      toast({
        title: "Update Failed",
        description: "Unable to update crop information",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="animate-pulse text-xl">Loading farmer details...</div>
        </div>
      </Layout>
    );

  if (error)
    return (
      <Layout>
        <div className="container mx-auto py-12 px-4 md:px-6 flex items-center justify-center min-h-[calc(100vh-200px)]">
          <Card className="border-destructive w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
              <Button
                variant="outline"
                onClick={() => window.history.back()}
                className="mt-4"
              >
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );

  const formattedDate = farmer?.date ? new Date(farmer.date) : null;

  // Generate all events in chronological order if API data is available
  const generateAllEvents = (): Event[] => {
    if (!apiCropData || !formattedDate) return [];

    const events: Event[] = [];

    // Add stages
    apiCropData.stages.forEach((stage) => {
      events.push({
        day: stage.day,
        date: new Date(formattedDate.getTime() + stage.day * 86400000),
        type: "Growth Stage",
        details: stage.name,
      });
    });

    // Add water schedule
    apiCropData.waterSchedule.forEach((water) => {
      events.push({
        day: water.day,
        date: new Date(formattedDate.getTime() + water.day * 86400000),
        type: "Watering",
        details: water.amount,
      });
    });

    // Add fertilizer schedule
    apiCropData.fertilizerSchedule.forEach((fert) => {
      events.push({
        day: fert.day,
        date: new Date(formattedDate.getTime() + fert.day * 86400000),
        type: "Fertilizing",
        details: `${fert.type} - ${fert.amount}`,
      });
    });

    // Sort by day
    return events.sort((a, b) => a.day - b.day);
  };

  const allEvents = generateAllEvents();

  return (
    <Layout>
      <div style={{ padding: "20px" }}>
        <h2>Farmer Details</h2>
        <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
          <tbody>
            <tr>
              <td>
                <strong>Name:</strong>
              </td>
              <td>{farmer?.name}</td>
            </tr>
            <tr>
              <td>
                <strong>Area:</strong>
              </td>
              <td>{farmer?.area}</td>
            </tr>
            <tr>
              <td>
                <strong>Land Area:</strong>
              </td>
              <td>{farmer?.landArea} acres</td>
            </tr>
            <tr>
              <td>
                <strong>Phone:</strong>
              </td>
              <td>{farmer?.phone}</td>
            </tr>
            <tr>
              <td>
                <strong>Email:</strong>
              </td>
              <td>{farmer?.email}</td>
            </tr>
            <tr>
              <td>
                <strong>Date of Starting:</strong>
              </td>
              <td>{formattedDate?.toLocaleDateString()}</td>
            </tr>
            <tr>
              <td>
                <strong>Selected Crop:</strong>
              </td>
              <td>{farmer?.selectedCrop || "Not Selected"}</td>
            </tr>
          </tbody>
        </table>

        <div style={{ margin: "20px 0" }}>
          <input
            type="text"
            placeholder="Enter new crop"
            value={newCrop}
            onChange={(e) => setNewCrop(e.target.value)}
            style={{ padding: "8px", marginRight: "10px" }}
          />
          <button
            onClick={handleUpdateCrop}
            disabled={updating}
            style={{ padding: "8px 16px" }}
          >
            {updating ? "Updating..." : "Update Crop"}
          </button>
        </div>

        {loadingCropData && (
          <div className="text-center py-8">
            <div className="animate-pulse">Loading crop data...</div>
          </div>
        )}

        {farmer?.selectedCrop && apiCropData && !loadingCropData && (
          <div>
            <h3>Crop Information: {farmer?.selectedCrop}</h3>
            <p>
              <strong>Total Duration:</strong> {apiCropData.duration} days
            </p>

            <h4>All Events (Chronological Order)</h4>
            <table
              border="1"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "8px", textAlign: "left" }}>Day</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Type</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {allEvents.map((event, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>Day {event.day}</td>
                    <td style={{ padding: "8px" }}>
                      {event.date?.toLocaleDateString() || "N/A"}
                    </td>
                    <td style={{ padding: "8px" }}>{event.type}</td>
                    <td style={{ padding: "8px" }}>{event.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Growth Stages</h4>
            <table
              border="1"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "8px", textAlign: "left" }}>Day</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Stage</th>
                </tr>
              </thead>
              <tbody>
                {apiCropData.stages.map((stage, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>Day {stage.day}</td>
                    <td style={{ padding: "8px" }}>
                      {formattedDate
                        ? new Date(
                            formattedDate.getTime() + stage.day * 86400000
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={{ padding: "8px" }}>{stage.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Water Schedule</h4>
            <table
              border="1"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "8px", textAlign: "left" }}>Day</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>
                    Water Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {apiCropData.waterSchedule.map((water, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>Day {water.day}</td>
                    <td style={{ padding: "8px" }}>
                      {formattedDate
                        ? new Date(
                            formattedDate.getTime() + water.day * 86400000
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={{ padding: "8px" }}>{water.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Fertilizer Schedule</h4>
            <table
              border="1"
              style={{ borderCollapse: "collapse", width: "100%" }}
            >
              <thead>
                <tr>
                  <th style={{ padding: "8px", textAlign: "left" }}>Day</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "8px", textAlign: "left" }}>
                    Fertilizer Type
                  </th>
                  <th style={{ padding: "8px", textAlign: "left" }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {apiCropData.fertilizerSchedule.map((fert, index) => (
                  <tr key={index}>
                    <td style={{ padding: "8px" }}>Day {fert.day}</td>
                    <td style={{ padding: "8px" }}>
                      {formattedDate
                        ? new Date(
                            formattedDate.getTime() + fert.day * 86400000
                          ).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td style={{ padding: "8px" }}>{fert.type}</td>
                    <td style={{ padding: "8px" }}>{fert.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FarmerDetails;
