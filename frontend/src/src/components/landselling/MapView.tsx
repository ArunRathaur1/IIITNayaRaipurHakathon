
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { LandListing, getGoogleMapsUrl } from "@/types/landselling";
import { ExternalLink, MapPin, Search, Filter } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getListings } from "@/services/landListingService";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

interface MapViewProps {
  listings: LandListing[];
  activeTab: string;
}

export default function MapView({ listings: propListings, activeTab }: MapViewProps) {
  const [listings, setListings] = useState<LandListing[]>(propListings || []);
  const [filteredListings, setFilteredListings] = useState<LandListing[]>(propListings || []);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [searchTitle, setSearchTitle] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 5000]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [maxArea, setMaxArea] = useState(5000);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const mainMapRef = useRef<L.Map | null>(null);
  const mainMapContainerRef = useRef<HTMLDivElement>(null);
  const [isMainMapInitialized, setIsMainMapInitialized] = useState(false);

  // Fetch listings from API and fall back to local storage
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setIsLoading(true);
        // First try to get listings from the API
        const response = await fetch("http://localhost:5000/api/land/", {
          signal: AbortSignal.timeout(3000) // Timeout after 3 seconds
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status}`);
        }

        const data = await response.json();
        // If we successfully got data from the API, use it
        setListings(data);
        setFilteredListings(data);

        // Set max values for filters based on data
        if (data.length > 0) {
          const maxP = Math.max(
            ...data.map((listing: LandListing) => listing.price)
          );
          const maxA = Math.max(
            ...data.map((listing: LandListing) => listing.area)
          );
          setMaxPrice(maxP);
          setMaxArea(maxA);
          setPriceRange([0, maxP]);
          setAreaRange([0, maxA]);
        }
      } catch (err) {
        console.warn("API fetch failed, falling back to local storage:", err);
        // Fallback to local storage
        const localStorageListings = getListings();
        if (localStorageListings && localStorageListings.length > 0) {
          setListings(localStorageListings);
          setFilteredListings(localStorageListings);
          
          // Set max values for filters based on data
          const maxP = Math.max(
            ...localStorageListings.map((listing) => listing.price)
          );
          const maxA = Math.max(
            ...localStorageListings.map((listing) => listing.area)
          );
          setMaxPrice(maxP);
          setMaxArea(maxA);
          setPriceRange([0, maxP]);
          setAreaRange([0, maxA]);
        } else {
          // If no data in local storage either, use prop listings
          if (propListings && propListings.length > 0) {
            setListings(propListings);
            setFilteredListings(propListings);
            
            // Set max values for filters based on data
            const maxP = Math.max(
              ...propListings.map((listing) => listing.price)
            );
            const maxA = Math.max(
              ...propListings.map((listing) => listing.area)
            );
            setMaxPrice(maxP);
            setMaxArea(maxA);
            setPriceRange([0, maxP]);
            setAreaRange([0, maxA]);
          } else {
            setError("No listings available. Please add some listings first.");
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [propListings]);

  // Apply filters effect
  useEffect(() => {
    if (listings.length === 0) return;

    const filtered = listings.filter((listing) => {
      const titleMatch = listing.title
        .toLowerCase()
        .includes(searchTitle.toLowerCase());
      const priceMatch =
        listing.price >= priceRange[0] && listing.price <= priceRange[1];
      const areaMatch =
        listing.area >= areaRange[0] && listing.area <= areaRange[1];

      return titleMatch && priceMatch && areaMatch;
    });

    setFilteredListings(filtered);
  }, [searchTitle, priceRange, areaRange, listings]);

  // Initialize the main map (once)
  useEffect(() => {
    if (!mainMapContainerRef.current) return;

    // Only initialize map if it's not already initialized
    if (activeTab === "map" && !isMainMapInitialized) {
      // Fix for Leaflet's icon
      // Use default icon path in leaflet's assets folder
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });

      const mapInstance = L.map(mainMapContainerRef.current).setView(
        [20.5937, 78.9629],
        5
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance);

      mainMapRef.current = mapInstance;
      setIsMainMapInitialized(true);
    }

    return () => {
      if (mainMapRef.current && activeTab !== "map") {
        mainMapRef.current.remove();
        mainMapRef.current = null;
        setIsMainMapInitialized(false);
      }
    };
  }, [mainMapContainerRef.current, activeTab]);

  // Update main map markers when filtered listings change
  useEffect(() => {
    updateMainMapMarkers();
  }, [filteredListings, activeTab]);

  // Effect to handle visible tab resizing
  useEffect(() => {
    if (activeTab === "map" && mainMapRef.current) {
      setTimeout(() => {
        mainMapRef.current?.invalidateSize();
        updateMainMapMarkers();
      }, 100); // Short delay to ensure DOM is updated
    }
  }, [activeTab]);

  // Function to update markers on the main map
  const updateMainMapMarkers = () => {
    if (!mainMapRef.current || activeTab !== "map") return;

    // Clear existing markers
    mainMapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mainMapRef.current?.removeLayer(layer);
      }
    });

    // Add markers for each listing
    filteredListings.forEach((listing) => {
      const googleMapsUrl = getGoogleMapsUrl(listing.location);

      L.marker(listing.location)
        .addTo(mainMapRef.current!)
        .bindPopup(
          `
          <strong>${listing.title}</strong><br>
          Price: ₹${listing.price.toLocaleString()}<br>
          Area: ${listing.area} acres<br>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer">View on Google Maps</a>
        `
        )
        .on("click", () => {
          mainMapRef.current?.setView(listing.location, 12);
        });
    });

    // If we have listings and the map is initialized, fit bounds
    if (filteredListings.length > 0 && mainMapRef.current) {
      try {
        const bounds = L.latLngBounds(
          filteredListings.map((l) => L.latLng(l.location[0], l.location[1]))
        );
        mainMapRef.current.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {
        console.error("Error fitting bounds:", e);
        // Fallback to default view if bounds fitting fails
        mainMapRef.current.setView([20.5937, 78.9629], 5);
      }
    }
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return `₹${value.toLocaleString()}`;
  };

  return (
    <Card className={activeTab !== "map" ? "hidden" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Land Listings Map</CardTitle>
            <CardDescription>
              Browse available agricultural land for sale. Click on markers to
              view details.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {isFilterOpen ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>

        {isFilterOpen && (
          <div className="mt-4 space-y-4 p-4 bg-muted/30 rounded-md">
            <div>
              <Label htmlFor="search-title">Search by Title</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-title"
                  placeholder="Search listings..."
                  className="pl-8"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label className="mb-1 block">
                Price Range: {formatCurrency(priceRange[0])} -{" "}
                {formatCurrency(priceRange[1])}
              </Label>
              <Slider
                defaultValue={[0, maxPrice]}
                max={maxPrice}
                step={1000}
                value={priceRange}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
                className="mb-4"
              />
            </div>

            <div>
              <Label className="mb-1 block">
                Area Range: {areaRange[0]} - {areaRange[1]} acres
              </Label>
              <Slider
                defaultValue={[0, maxArea]}
                max={maxArea}
                step={10}
                value={areaRange}
                onValueChange={(value) =>
                  setAreaRange(value as [number, number])
                }
              />
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTitle("");
                  setPriceRange([0, maxPrice]);
                  setAreaRange([0, maxArea]);
                }}
              >
                Reset Filters
              </Button>

              <Badge variant="secondary">
                {filteredListings.length} of {listings.length} listings shown
              </Badge>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="h-96 w-full flex items-center justify-center bg-muted/20 rounded-md">
            <p>Loading map and listings...</p>
          </div>
        ) : error ? (
          <div className="h-96 w-full flex items-center justify-center bg-destructive/20 rounded-md">
            <p className="text-destructive">Error: {error}</p>
          </div>
        ) : (
          <div
            ref={mainMapContainerRef}
            className="h-96 w-full rounded-md border"
          />
        )}
      </CardContent>

      <CardFooter className="bg-muted/30">
        <div className="w-full">
          <p className="text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 inline mr-1" />
            {filteredListings.length} listing
            {filteredListings.length !== 1 ? "s" : ""} available
          </p>
          {filteredListings.length > 0 && (
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">Recent Listings:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {filteredListings.slice(-3).map((listing, idx) => (
                  <Button
                    key={listing.id || idx}
                    variant="outline"
                    className="h-auto py-2 justify-start text-left"
                    onClick={() => {
                      if (mainMapRef.current)
                        mainMapRef.current.setView(listing.location, 12);
                    }}
                  >
                    <div className="w-full flex justify-between items-center">
                      <div>
                        <p className="font-medium truncate">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{listing.price.toLocaleString()} • {listing.area}{" "}
                          acres
                        </p>
                      </div>
                      <a
                        href={getGoogleMapsUrl(listing.location)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
