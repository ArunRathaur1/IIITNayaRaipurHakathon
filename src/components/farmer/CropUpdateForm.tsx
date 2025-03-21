
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout } from "lucide-react";

interface CropUpdateFormProps {
  handleUpdateCrop: () => void;
  newCrop: string;
  setNewCrop: (value: string) => void;
  updating: boolean;
}

const CropUpdateForm: React.FC<CropUpdateFormProps> = ({
  handleUpdateCrop,
  newCrop,
  setNewCrop,
  updating
}) => {
  return (
    <Card className="bg-card/80 backdrop-blur-sm border-border/40 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Update Crop</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
              <Sprout size={16} />
            </div>
            <Input
              type="text"
              placeholder="Enter new crop"
              value={newCrop}
              onChange={(e) => setNewCrop(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <Button 
            onClick={handleUpdateCrop} 
            disabled={updating}
            className="bg-primary hover:bg-primary/90"
          >
            {updating ? "Updating..." : "Update Crop"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CropUpdateForm;
