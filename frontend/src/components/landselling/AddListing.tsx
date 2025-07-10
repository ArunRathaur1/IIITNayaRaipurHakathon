import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { LandListing, getGoogleMapsUrl } from "@/types/landselling";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ExternalLink, Plus } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { toast } from "@/components/ui/use-toast";

interface AddListingProps {
  activeTab: string;
  onAddListing: (listing: Omit<LandListing, "id">) => void;
  onListingAdded?: () => void;
}

export default function AddListing({
  activeTab,
  onAddListing,
  onListingAdded,
}: AddListingProps) {
  const locationMapRef = useRef<L.Map | null>(null);
  const locationMapContainerRef = useRef<HTMLDivElement>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);
  const [isLocationMapInitialized, setIsLocationMapInitialized] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactNumber, setContactNumber] = useState(""); // New state for contact number
  const [newListing, setNewListing] = useState<Omit<LandListing, "id">>({
    title: "",
    description: "",
    price: 0,
    area: 0,
    location: [20.5937, 78.9629],
  });

  useEffect(() => {
    if (!locationMapContainerRef.current) return;

    if (activeTab === "add" && !isLocationMapInitialized) {
      // Fix for Leaflet's icon
      // Use default icon path in leaflet's assets folder
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });

      const mapInstance = L.map(locationMapContainerRef.current).setView(
        newListing.location,
        5
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      locationMarkerRef.current = L.marker(newListing.location).addTo(
        mapInstance
      );

      mapInstance.on("click", (e) => {
        const { lat, lng } = e.latlng;
        setNewListing((prev) => ({ ...prev, location: [lat, lng] }));
      });

      locationMapRef.current = mapInstance;
      setIsLocationMapInitialized(true);
    }

    return () => {
      if (locationMapRef.current && activeTab !== "add") {
        locationMapRef.current.remove();
        locationMapRef.current = null;
        setIsLocationMapInitialized(false);
      }
    };
  }, [locationMapContainerRef.current, activeTab]);

  useEffect(() => {
    if (activeTab === "add" && locationMapRef.current) {
      setTimeout(() => {
        locationMapRef.current?.invalidateSize();
        updateLocationMarker();
      }, 100);
    }
  }, [activeTab]);

  useEffect(() => {
    updateLocationMarker();
  }, [newListing.location]);

  const updateLocationMarker = () => {
    if (
      !locationMapRef.current ||
      !locationMarkerRef.current ||
      activeTab !== "add"
    )
      return;

    locationMarkerRef.current.setLatLng(newListing.location);
    locationMapRef.current.setView(
      newListing.location,
      locationMapRef.current.getZoom()
    );
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewListing((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "area" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleReset = () => {
    setNewListing({
      title: "",
      description: "",
      price: 0,
      area: 0,
      location: [20.5937, 78.9629],
    });
    setContactNumber(""); // Reset contact number
  };

  const saveListing = async (listing: Omit<LandListing, "id">) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:10000/api/land/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(listing),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const savedListing = await response.json();
      console.log("Listing saved successfully:", savedListing);
      return savedListing;
    } catch (error) {
      console.error("Failed to save listing:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateListing = (listing: Omit<LandListing, "id">) => {
    if (!listing.title.trim()) return "Title is required";
    if (!listing.description.trim()) return "Description is required";
    if (listing.price <= 0) return "Price must be greater than zero";
    if (listing.area <= 0) return "Area must be greater than zero";
    if (!contactNumber.trim()) return "Contact number is required"; // Validate contact number
    return null;
  };

  const handleAddListing = async () => {
    const listingToAdd = {
      ...newListing,
    };

    const validationError = validateListing(listingToAdd);
    if (validationError) {
      toast({
        title: "Validation Error",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    try {
      // First save to API (contact number is not included here)
      await saveListing(listingToAdd);

      // Then notify parent component
      onAddListing(listingToAdd);

      // Reset form
      handleReset();

      // Trigger refresh of listings
      if (onListingAdded) onListingAdded();

      toast({
        title: "Success",
        description: "Land listing added successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add listing. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={activeTab !== "add" ? "hidden" : ""}>
      <CardHeader>
        <CardTitle>Add New Land Listing</CardTitle>
        <CardDescription>
          Fill in the details below to list your agricultural land for sale
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Listing Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g., Fertile Farmland near Pune"
            value={newListing.title}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Describe your land, soil quality, nearby water sources, etc."
            rows={4}
            value={newListing.description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="Enter price in rupees"
              value={newListing.price || ""}
              onChange={handleInputChange}
              required
              min="1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="area">Area (acres)</Label>
            <Input
              id="area"
              name="area"
              type="number"
              placeholder="Land area in acres"
              value={newListing.area || ""}
              onChange={handleInputChange}
              required
              min="0.1"
              step="0.1"
            />
          </div>
        </div>

        {/* New Contact Number Field */}
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            type="tel"
            placeholder="Enter your contact number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            required
          />
        </div>

        <div className="pt-4">
          <p className="text-sm mb-2 font-medium">Location</p>
          <div className="border rounded-md p-3 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-1">
              Click on the map to set the location, or enter coordinates
              manually:
            </p>

            <div
              ref={locationMapContainerRef}
              className="h-40 w-full mb-3 rounded border"
            ></div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="lat" className="text-xs">
                  Latitude
                </Label>
                <Input
                  id="lat"
                  type="number"
                  value={newListing.location[0]}
                  onChange={(e) =>
                    setNewListing((prev) => ({
                      ...prev,
                      location: [
                        parseFloat(e.target.value) || 0,
                        prev.location[1],
                      ],
                    }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lng" className="text-xs">
                  Longitude
                </Label>
                <Input
                  id="lng"
                  type="number"
                  value={newListing.location[1]}
                  onChange={(e) =>
                    setNewListing((prev) => ({
                      ...prev,
                      location: [
                        prev.location[0],
                        parseFloat(e.target.value) || 0,
                      ],
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-2 flex justify-end">
              <a
                href={getGoogleMapsUrl(newListing.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-700 flex items-center"
              >
                View on Google Maps
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/30 flex justify-between">
        <Button variant="ghost" onClick={handleReset} disabled={isSubmitting}>
          Reset
        </Button>
        <Button
          onClick={handleAddListing}
          className="gap-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Listing
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}