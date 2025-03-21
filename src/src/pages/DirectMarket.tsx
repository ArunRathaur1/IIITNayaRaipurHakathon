import { useState, useEffect } from 'react';
import { ShoppingBag, Users, Building, Truck, Plus } from 'lucide-react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MarketplaceItem = ({ 
  title, 
  price, 
  quantity, 
  location, 
  seller, 
  image, 
  category 
}: {
  title: string;
  price: string;
  quantity: string;
  location: string;
  seller: string;
  image: string;
  category: string;
}) => {
  const { toast } = useToast();

  const handleContactSeller = () => {
    toast({
      title: "Contact Request Sent",
      description: `Your request to contact ${seller} has been sent.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 bg-muted">
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">{category}</Badge>
        </div>
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ShoppingBag className="h-12 w-12" />
          </div>
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="flex justify-between">
          <span>{location}</span>
          <span className="font-medium text-primary">{price}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 pb-2">
        <div className="text-sm">
          <span className="font-medium">Quantity:</span> {quantity}
        </div>
        <div className="text-sm">
          <span className="font-medium">Seller:</span> {seller}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleContactSeller} className="w-full">Contact Seller</Button>
      </CardFooter>
    </Card>
  );
};

// Add a new component for the listing form
const ListingForm = ({ onAddProduct, onClose }) => {
  const [newProduct, setNewProduct] = useState({
    title: '',
    price: '',
    quantity: '',
    location: '',
    seller: '',
    image: '',
    category: '',
    type: 'consumer' // Default to consumer market
  });

  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newProduct.title || !newProduct.price || !newProduct.quantity || !newProduct.location || !newProduct.seller || !newProduct.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    onAddProduct(newProduct);
    toast({
      title: "Product Listed Successfully",
      description: "Your product has been added to the marketplace.",
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Product Title *</Label>
        <Input
          id="title"
          name="title"
          value={newProduct.title}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
            placeholder="₹00/unit"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity Available *</Label>
          <Input
            id="quantity"
            name="quantity"
            value={newProduct.quantity}
            onChange={handleChange}
            placeholder="e.g., 500 kg available"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            name="location"
            value={newProduct.location}
            onChange={handleChange}
            placeholder="City, State"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seller">Seller Name *</Label>
          <Input
            id="seller"
            name="seller"
            value={newProduct.seller}
            onChange={handleChange}
            placeholder="Your name or business name"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            name="category"
            value={newProduct.category}
            onChange={handleChange}
            placeholder="e.g., Vegetables, Grains"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Market Type *</Label>
          <Select
            name="type"
            value={newProduct.type}
            onValueChange={(value) => handleSelectChange('type', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select market type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consumer">Consumer Market</SelectItem>
              <SelectItem value="industry">Industry Supply</SelectItem>
              <SelectItem value="equipment">Equipment Rental</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image">Image URL (Optional)</Label>
        <Input
          id="image"
          name="image"
          value={newProduct.image}
          onChange={handleChange}
          placeholder="Enter image URL"
        />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">List Product</Button>
      </DialogFooter>
    </form>
  );
};

const DirectMarket = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showListingForm, setShowListingForm] = useState(false);
  const { toast } = useToast();
  
  // Initialize state with existing items
  const [consumerItems, setConsumerItems] = useState([
    {
      title: "Organic Rice",
      price: "₹35/kg",
      quantity: "500 kg available",
      location: "Bangalore, Karnataka",
      seller: "Krishna Farms",
      image:
        "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop&q=80",
      category: "Grains",
    },
    {
      title: "Fresh Tomatoes",
      price: "₹25/kg",
      quantity: "200 kg available",
      location: "Pune, Maharashtra",
      seller: "Sunshine Organics",
      image:
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
      category: "Vegetables",
    },
    {
      title: "Alphonso Mangoes",
      price: "₹400/dozen",
      quantity: "50 dozen available",
      location: "Ratnagiri, Maharashtra",
      seller: "Coastal Orchards",
      image:
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
      category: "Fruits",
    },
    {
      title: "Organic Wheat",
      price: "₹30/kg",
      quantity: "1000 kg available",
      location: "Ludhiana, Punjab",
      seller: "Punjab Agro Farms",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2023/5/310043896/VX/HT/NI/156804476/organic-wheat-for-food-industries.webp",
      category: "Grains",
    },
  ]);

  const [industryItems, setIndustryItems] = useState([
    {
      title: "Raw Cotton Bulk",
      price: "₹60,000/ton",
      quantity: "10 tons available",
      location: "Ahmedabad, Gujarat",
      seller: "Gujarat Cotton Cooperative",
      image:
        "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80",
      category: "Fiber",
    },
    {
      title: "Sugarcane for Processing",
      price: "₹2,500/ton",
      quantity: "100 tons available",
      location: "Kolhapur, Maharashtra",
      seller: "Kolhapur Agro Industries",
      image:
        "https://www.saferack.com/wp-content/uploads/2022/11/sugarcane-being-harvested.webp",
      category: "Sugar Crops",
    },
    {
      title: "Bulk Potatoes for Chips",
      price: "₹15/kg",
      quantity: "5000 kg available",
      location: "Agra, Uttar Pradesh",
      seller: "UP Potato Farms",
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
      category: "Vegetables",
    },
    {
      title: "Soybean for Oil Extraction",
      price: "₹40,000/ton",
      quantity: "15 tons available",
      location: "Indore, Madhya Pradesh",
      seller: "Central India Farmers Association",
      image:
        "https://www.sunrisefoods.com/wp-content/uploads/2020/11/soybean-oil-2.jpg",
      category: "Oil Seeds",
    },
  ]);

  const [rentalItems, setRentalItems] = useState([
    {
      title: "Heavy-Duty Tractor",
      price: "₹5,000/day",
      quantity: "5 available",
      location: "Nagpur, Maharashtra",
      seller: "Agri Equipment Rentals",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVvn3Kj1qeTa8Y7iuJ8D52xVQOroCZCJCqbw&s",
      category: "Tractor",
    },
    {
      title: "Transport Truck",
      price: "₹10,000/day",
      quantity: "3 available",
      location: "Ludhiana, Punjab",
      seller: "Punjab Logistics",
      image:
        "https://5.imimg.com/data5/SELLER/Default/2020/10/SD/WM/NW/115809247/full-load-service-500x500.jpg",
      category: "Truck",
    },
    {
      title: "Combine Harvester",
      price: "₹8,000/day",
      quantity: "2 available",
      location: "Indore, Madhya Pradesh",
      seller: "Central Farm Rentals",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQQX8rltk_k5N7CUgcA7Bf5TtG_TIp0RJI4w&s",
      category: "Harvester",
    },
    {
      title: "Plowing Machine",
      price: "₹3,500/day",
      quantity: "10 available",
      location: "Kanpur, Uttar Pradesh",
      seller: "UP Farm Equipment",
      image: "https://i.ytimg.com/vi/uFXwdX9qQG4/maxresdefault.jpg",
      category: "Plowing Machine",
    },
  ]);
  
  // Current active tab
  const [activeTab, setActiveTab] = useState('consumer');

  // Add new product function
  const handleAddProduct = (product) => {
    // Determine which array to add to based on the type
    if (product.type === 'consumer') {
      setConsumerItems(prev => [product, ...prev]);
    } else if (product.type === 'industry') {
      setIndustryItems(prev => [product, ...prev]);
    } else if (product.type === 'equipment') {
      setRentalItems(prev => [product, ...prev]);
    }
    
    // Automatically switch to the tab where the product was added
    setActiveTab(product.type);
  };

  // Filter items based on search term
  const filteredConsumerItems = consumerItems.filter(
    item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredIndustryItems = industryItems.filter(
    item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredRentalItems = rentalItems.filter(
    item => 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <section className="py-12 pt-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-3xl font-bold tracking-tight">Direct Market Access</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Connect directly with consumers and industries to sell your produce without intermediaries
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div className="w-full md:w-2/3 relative">
              <Input
                type="search"
                placeholder="Search by product, location, or seller..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Replace button with Dialog */}
            <Dialog open={showListingForm} onOpenChange={setShowListingForm}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  List Your Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>List a New Product</DialogTitle>
                  <DialogDescription>
                    Enter your product details to list it on the marketplace.
                  </DialogDescription>
                </DialogHeader>
                <ListingForm 
                  onAddProduct={handleAddProduct} 
                  onClose={() => setShowListingForm(false)} 
                />
              </DialogContent>
            </Dialog>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex w-full justify-between mb-8">
              <TabsTrigger value="consumer" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Consumer Market</span>
              </TabsTrigger>
              <TabsTrigger value="industry" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Industry Supply</span>
              </TabsTrigger>
              <TabsTrigger value="equipment" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Equipment Rental</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="consumer" className="mt-0">
              {filteredConsumerItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredConsumerItems.map((item, index) => (
                    <MarketplaceItem key={`consumer-${index}`} {...item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "Be the first to list a product in this category"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="industry" className="mt-0">
              {filteredIndustryItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredIndustryItems.map((item, index) => (
                    <MarketplaceItem key={`industry-${index}`} {...item} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "Be the first to list a product in this category"}
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="equipment" className="mt-0">
              {filteredRentalItems.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredRentalItems.map((item, index) => (
                    <MarketplaceItem key={`rental-${index}`} {...item} />
                  ))}  
                </div>
              ) : (
                <div className="text-center py-12">
                  <Truck className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No products found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "Be the first to list a product in this category"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-12 p-6 bg-muted rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-medium">Need Transportation for Your Goods?</h3>
                <p className="text-muted-foreground mt-2">
                  Connect with local logistics providers to transport your produce.
                </p>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Find Transportation</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default DirectMarket;