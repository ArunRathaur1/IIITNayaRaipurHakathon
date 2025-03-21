
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./FarmerDetails.css";
import axios from "axios";
import Layout from "../components/Layout";
import { Calendar, Droplets, Sprout } from "lucide-react";

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

const cropData: Record<string, any> = {
    Rice: { 
        duration: 120, 
        waterSchedule: [{ day: 0, amount: "50mm" }, { day: 30, amount: "100mm" }, { day: 60, amount: "150mm" }],
        fertilizerSchedule: [{ day: 15, type: "Urea", amount: "20kg/acre" }, { day: 45, type: "DAP", amount: "30kg/acre" }],
        stages: [{ name: "Ploughing", day: 0 }, { name: "Sowing", day: 7 }, { name: "Irrigation", day: 30 }, { name: "Harvesting", day: 120 }]
    },
    Maize: { 
        duration: 90, 
        waterSchedule: [{ day: 0, amount: "40mm" }, { day: 20, amount: "80mm" }],
        fertilizerSchedule: [{ day: 20, type: "Urea", amount: "25kg/acre" }],
        stages: [{ name: "Ploughing", day: 0 }, { name: "Sowing", day: 10 }, { name: "Weeding", day: 30 }, { name: "Harvesting", day: 90 }]
    },
    Wheat: { 
        duration: 140, 
        waterSchedule: [{ day: 0, amount: "30mm" }, { day: 50, amount: "60mm" }],
        fertilizerSchedule: [{ day: 25, type: "Urea", amount: "30kg/acre" }, { day: 75, type: "DAP", amount: "25kg/acre" }],
        stages: [{ name: "Ploughing", day: 0 }, { name: "Sowing", day: 15 }, { name: "Irrigation", day: 50 }, { name: "Harvesting", day: 140 }]
    }
};

const FarmerDetails: React.FC = () => {
    const { phone } = useParams<{ phone: string }>();
    const [farmer, setFarmer] = useState<Farmer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [newCrop, setNewCrop] = useState<string>("");
    const [updating, setUpdating] = useState<boolean>(false);

    useEffect(() => {
        const fetchFarmer = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/farmers/phone/${phone}`);
                setFarmer(response.data);
            } catch (err: unknown) {
                setError("Farmer not found");
            } finally {
                setLoading(false);
            }
        };
        fetchFarmer();
    }, [phone]);

    const handleUpdateCrop = async () => {
        if (!newCrop.trim() || !farmer) return;
        try {
            setUpdating(true);
            const response = await axios.patch(`http://localhost:5000/api/farmers/${farmer._id}/crop`, {
                selectedCrop: newCrop
            });
            setFarmer(response.data.farmer);
            setNewCrop("");
        } catch (error) {
            console.error("Error updating crop", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <Layout>
            <div className="container flex items-center justify-center h-[70vh]">
                <div className="text-xl animate-pulse">Loading farmer details...</div>
            </div>
        </Layout>
    );
    
    if (error) return (
        <Layout>
            <div className="container flex items-center justify-center h-[70vh]">
                <div className="text-xl text-destructive">{error}</div>
            </div>
        </Layout>
    );

    const formattedDate = farmer?.date ? new Date(farmer.date) : null;
    const cropInfo = farmer?.selectedCrop ? cropData[farmer.selectedCrop] : null;

    // Generate daily tasks
    const dailyTasks: { date: Date; task: string }[] = [];

    if (cropInfo && formattedDate) {
        [...cropInfo.stages, ...cropInfo.waterSchedule, ...cropInfo.fertilizerSchedule].forEach((event: any) => {
            const eventDate = new Date(formattedDate.getTime() + event.day * 86400000);
            let taskDescription = "";

            if (event.name) {
                taskDescription = `Stage: ${event.name}`;
            } else if (event.amount && event.type) {
                taskDescription = `Fertilizer: Apply ${event.amount} of ${event.type}`;
            } else if (event.amount) {
                taskDescription = `Watering: ${event.amount}`;
            }

            dailyTasks.push({ date: eventDate, task: taskDescription });
        });

        // Sort tasks by date
        dailyTasks.sort((a, b) => a.date.getTime() - b.date.getTime());
    }

    return (
        <Layout>
            <div className="container py-8 px-4">
                <div className="farmer-details-container glass-panel">
                    <h2 className="text-2xl font-semibold mb-6">Farmer Details</h2>
                    <div className="farmer-card">
                        <div className="farmer-info w-full">
                            <p><strong>Name:</strong> {farmer?.name}</p>
                            <p><strong>Area:</strong> {farmer?.area}</p>
                            <p><strong>Land Area:</strong> {farmer?.landArea} acres</p>
                            <p><strong>Phone:</strong> {farmer?.phone}</p>
                            <p><strong>Email:</strong> {farmer?.email}</p>
                            <p><strong>Date of Starting:</strong> {formattedDate?.toLocaleDateString()}</p>
                            <p><strong>Selected Crop:</strong> {farmer?.selectedCrop || "Not Selected"}</p>
                        </div>

                        <div className="crop-update mt-6 w-full">
                            <input
                                type="text"
                                placeholder="Enter new crop"
                                value={newCrop}
                                onChange={(e) => setNewCrop(e.target.value)}
                                className="input-field"
                            />
                            <button 
                                onClick={handleUpdateCrop} 
                                disabled={updating} 
                                className="update-button"
                            >
                                {updating ? "Updating..." : "Update Crop"}
                            </button>
                        </div>
                        
                        {cropInfo && formattedDate && (
                            <div className="crop-details w-full mt-8">
                                <h3 className="text-xl font-medium flex items-center gap-2">
                                    <Sprout className="h-5 w-5" /> Crop Schedule: {farmer?.selectedCrop}
                                </h3>
                                
                                <div className="mt-4">
                                    <h4 className="text-lg font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Daily Tasks
                                    </h4>
                                    <ul className="list-disc pl-6 mt-2">
                                        {dailyTasks.map((task, index) => (
                                            <li key={index} className="py-1">
                                                <span className="font-medium">{task.date.toLocaleDateString()}</span> - {task.task}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div className="mt-4">
    <h4 className="text-lg font-medium flex items-center gap-2">
        <Droplets className="h-4 w-4" /> Water Schedule
    </h4>
    <ul className="list-disc pl-6 mt-2">
        {cropInfo.waterSchedule.map((water: any, index: number) => (
            <li key={index} className="py-1">
                {new Date(formattedDate.getTime() + water.day * 86400000).toLocaleDateString()}: {water.amount} of water
            </li>
        ))}
    </ul>
</div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default FarmerDetails;
