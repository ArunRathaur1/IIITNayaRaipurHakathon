import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Layout from '../components/Layout';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Leaflet fix
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LandListing {
    _id: string;
    title: string;
    description: string;
    location: {
        type: string;
        coordinates: [number, number];
    };
    price: number;
    area: number;
    contact: string;
    date: string;
}

const Landselling: React.FC = () => {
    const [listings, setListings] = useState<LandListing[]>([]);
    const [newListing, setNewListing] = useState({
        title: '',
        description: '',
        latitude: 0,
        longitude: 0,
        price: 0,
        area: 0,
        contact: ''
    });
    const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to New York
    const [zoomLevel, setZoomLevel] = useState<number>(6);

    useEffect(() => {
        fetchListings();
    }, []);

    const fetchListings = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/landlistings');
            setListings(response.data);
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewListing({ ...newListing, [e.target.name]: e.target.value });
    };

    const handleMapClick = (e: any) => {
        setNewListing({
            ...newListing,
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newListingData = {
                ...newListing,
                location: {
                    type: "Point",
                    coordinates: [parseFloat(newListing.longitude.toString()), parseFloat(newListing.latitude.toString())]
                }
            };
            await axios.post('http://localhost:5000/api/landlistings', newListingData);
            fetchListings();
            setNewListing({
                title: '',
                description: '',
                latitude: 0,
                longitude: 0,
                price: 0,
                area: 0,
                contact: ''
            });
            alert('Listing added successfully!');
        } catch (error) {
            console.error('Error adding listing:', error);
            alert('Error adding listing.');
        }
    };

    function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
        const map = useMap();
        useEffect(() => {
            map.setView(center, zoom);
        }, [center, zoom, map]);
        return null;
    }

    return (
        <Layout>
            <div className="container mx-auto py-24 px-4 md:px-6">
                <Card className="border-border/40 shadow-lg bg-card/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">Land Marketplace</CardTitle>
                        <CardDescription className="text-center">Find or list agricultural land for sale or lease</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="tab1" className="space-y-4">
                            <TabsList className="bg-card/80 rounded-lg border border-border/40 mb-4">
                                <TabsTrigger value="tab1" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    List Your Land
                                </TabsTrigger>
                                <TabsTrigger value="tab2" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    All Listings
                                </TabsTrigger>
                                <TabsTrigger value="tab3" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                    Map View
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="tab1" className="space-y-4">
                                <Card className="bg-background/60">
                                    <CardHeader>
                                        <CardTitle>Add New Listing</CardTitle>
                                        <CardDescription>Fill in the details to list your land</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="title">Title</Label>
                                                <Input type="text" id="title" name="title" value={newListing.title} onChange={handleInputChange} required className="bg-background/50" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea id="description" name="description" value={newListing.description} onChange={handleInputChange} required className="bg-background/50" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="latitude">Latitude</Label>
                                                    <Input type="number" id="latitude" name="latitude" value={newListing.latitude} onChange={handleInputChange} required className="bg-background/50" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="longitude">Longitude</Label>
                                                    <Input type="number" id="longitude" name="longitude" value={newListing.longitude} onChange={handleInputChange} required className="bg-background/50" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="price">Price</Label>
                                                    <Input type="number" id="price" name="price" value={newListing.price} onChange={handleInputChange} required className="bg-background/50" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="area">Area (acres)</Label>
                                                    <Input type="number" id="area" name="area" value={newListing.area} onChange={handleInputChange} required className="bg-background/50" />
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="contact">Contact</Label>
                                                <Input type="text" id="contact" name="contact" value={newListing.contact} onChange={handleInputChange} required className="bg-background/50" />
                                            </div>
                                            <Button type="submit" className="w-full">List Land</Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="tab2">
                                <Card className="bg-background/60">
                                    <CardHeader>
                                        <CardTitle>All Land Listings</CardTitle>
                                        <CardDescription>Browse available land listings</CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-4">
                                        {listings.map(listing => (
                                            <Card key={listing._id} className="bg-card/90">
                                                <CardHeader>
                                                    <CardTitle>{listing.title}</CardTitle>
                                                    <CardDescription>Area: {listing.area} acres</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <p>{listing.description}</p>
                                                    <p>Price: ${listing.price}</p>
                                                    <p>Contact: {listing.contact}</p>
                                                    <p className="text-sm text-muted-foreground">Posted: {new Date(listing.date).toLocaleDateString()}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="tab3">
                                <Card className="bg-background/60">
                                    <CardHeader>
                                        <CardTitle>Map View</CardTitle>
                                        <CardDescription>Explore land listings on the map</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <MapContainer center={mapCenter} zoom={zoomLevel} style={{ height: '500px', width: '100%' }} onClick={handleMapClick}>
                                            <ChangeView center={mapCenter} zoom={zoomLevel} />
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            />
                                            {listings.map(listing => (
                                                <Marker
                                                    key={listing._id}
                                                    position={[listing.location.coordinates[1], listing.location.coordinates[0]]}
                                                >
                                                    <Popup>
                                                        <CardTitle>{listing.title}</CardTitle>
                                                        <CardDescription>Area: {listing.area} acres</CardDescription>
                                                        <CardContent className="space-y-2">
                                                            <p>{listing.description}</p>
                                                            <p>Price: ${listing.price}</p>
                                                            <p>Contact: {listing.contact}</p>
                                                        </CardContent>
                                                    </Popup>
                                                </Marker>
                                            ))}
                                            {newListing.latitude !== 0 && newListing.longitude !== 0 && (
                                                <Marker position={[newListing.latitude, newListing.longitude]}>
                                                    <Popup>
                                                        New Listing Location
                                                    </Popup>
                                                </Marker>
                                            )}
                                        </MapContainer>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Landselling;
