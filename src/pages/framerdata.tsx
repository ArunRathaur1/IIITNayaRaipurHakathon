import React, { useState, useEffect } from "react";
import axios from "axios";

const CropDataTable = ({ cropName }) => {
  const [cropData, setCropData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCropData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          "http://localhost:5000/api/ai/crop_data",
          {
            crop: cropName,
          }
        );

        if (response.data.success) {
          setCropData(response.data.data);
        } else {
          setError("Failed to fetch crop data");
        }
      } catch (err) {
        setError("Error connecting to server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (cropName) {
      fetchCropData();
    }
  }, [cropName]);

  if (loading) return <div>Loading crop data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cropData) return <div>No data available for {cropName}</div>;

  return (
    <div>
      <h3>Crop Information: {cropName}</h3>
      <p>
        <strong>Total Duration:</strong> {cropData.duration} days
      </p>

      <h4>Growth Stages</h4>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px", textAlign: "left" }}>Day</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Stage</th>
          </tr>
        </thead>
        <tbody>
          {cropData.stages.map((stage, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>Day {stage.day}</td>
              <td style={{ padding: "8px" }}>{stage.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Water Schedule</h4>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px", textAlign: "left" }}>Day</th>
            <th style={{ padding: "8px", textAlign: "left" }}>Water Amount</th>
          </tr>
        </thead>
        <tbody>
          {cropData.waterSchedule.map((water, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>Day {water.day}</td>
              <td style={{ padding: "8px" }}>{water.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Fertilizer Schedule</h4>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ padding: "8px", textAlign: "left" }}>Day</th>
            <th style={{ padding: "8px", textAlign: "left" }}>
              Fertilizer Type
            </th>
            <th style={{ padding: "8px", textAlign: "left" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {cropData.fertilizerSchedule.map((fert, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>Day {fert.day}</td>
              <td style={{ padding: "8px" }}>{fert.type}</td>
              <td style={{ padding: "8px" }}>{fert.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CropDataTable;
