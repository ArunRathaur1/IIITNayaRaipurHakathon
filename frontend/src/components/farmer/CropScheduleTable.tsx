
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, Sprout } from "lucide-react";

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
  duration: number;
  waterSchedule: WaterSchedule[];
  fertilizerSchedule: FertilizerSchedule[];
  stages: CropStage[];
}

interface CropScheduleTableProps {
  cropInfo: CropData;
  cropName: string;
  startDate: Date | null;
}

interface ScheduleEvent {
  day: number;
  type: string;
  details: string;
  date: Date | null;
}

const CropScheduleTable: React.FC<CropScheduleTableProps> = ({ 
  cropInfo, 
  cropName,
  startDate 
}) => {
  // Create a single array of all events sorted by day
  const allEvents: ScheduleEvent[] = [];

  // Add stages
  cropInfo.stages.forEach((stage) => {
    allEvents.push({
      day: stage.day,
      type: "Stage",
      details: stage.name,
      date: startDate
        ? new Date(startDate.getTime() + stage.day * 86400000)
        : null,
    });
  });

  // Add water schedule
  cropInfo.waterSchedule.forEach((water) => {
    allEvents.push({
      day: water.day,
      type: "Water",
      details: water.amount,
      date: startDate
        ? new Date(startDate.getTime() + water.day * 86400000)
        : null,
    });
  });

  // Add fertilizer schedule
  cropInfo.fertilizerSchedule.forEach((fert) => {
    allEvents.push({
      day: fert.day,
      type: "Fertilizer",
      details: `${fert.amount} of ${fert.type}`,
      date: startDate
        ? new Date(startDate.getTime() + fert.day * 86400000)
        : null,
    });
  });

  // Sort by day
  allEvents.sort((a, b) => a.day - b.day);

  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/40 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <Sprout className="mr-2" size={20} />
          Crop Schedule: {cropName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm mb-4">
          <span className="font-medium">Total Duration:</span> {cropInfo.duration} days
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allEvents.map((event, index) => (
              <TableRow key={index} className={getRowClass(event.type)}>
                <TableCell>Day {event.day}</TableCell>
                <TableCell>
                  {event.date?.toLocaleDateString() || "N/A"}
                </TableCell>
                <TableCell>{event.type}</TableCell>
                <TableCell>{event.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Helper function to get row class based on event type
function getRowClass(type: string): string {
  switch (type) {
    case "Stage":
      return "bg-primary/10";
    case "Water":
      return "bg-accent/10";
    case "Fertilizer":
      return "bg-secondary/10";
    default:
      return "";
  }
}

export default CropScheduleTable;
