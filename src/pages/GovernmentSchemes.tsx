
import { useState } from 'react';
import { FileText, Search, Filter, CreditCard, Sprout, BarChart3, Droplets, Tractor } from 'lucide-react';
import Layout from '@/components/Layout';
import SchemeCard from '@/components/SchemeCard';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Scheme {
  id: number;
  title: string;
  agency: string;
  description: string;
  deadline: string;
  category: string;
  type: string;
  icon: JSX.Element;
}

const schemes: Scheme[] = [
  {
    id: 1,
    title: "Pradhan Mantri Kisan Samman Nidhi",
    agency: "Ministry of Agriculture & Farmers Welfare",
    description: "Financial support of ₹6,000 per year in three equal installments to all farmer families across the country.",
    deadline: "Ongoing",
    category: "Financial Support",
    type: "subsidy",
    icon: <CreditCard className="h-6 w-6" />
  },
  {
    id: 2,
    title: "Green Agriculture Innovation Loan",
    agency: "Agricultural Development Bank",
    description: "Low-interest loans for farmers adopting sustainable farming practices and modern technologies.",
    deadline: "Dec 31, 2023",
    category: "Loan",
    type: "loan",
    icon: <Sprout className="h-6 w-6" />
  },
  {
    id: 3,
    title: "Productivity Enhancement Scheme",
    agency: "State Department of Agriculture",
    description: "Grants for high-yield crop varieties and advanced farming equipment to boost agricultural productivity.",
    deadline: "Nov 15, 2023",
    category: "Grant",
    type: "grant",
    icon: <BarChart3 className="h-6 w-6" />
  },
  {
    id: 4,
    title: "Irrigation Modernization Program",
    agency: "Water Resources Authority",
    description: "Subsidies for adopting modern irrigation systems like drip and sprinkler to improve water use efficiency.",
    deadline: "Feb 28, 2024",
    category: "Subsidy",
    type: "subsidy",
    icon: <Droplets className="h-6 w-6" />
  },
  {
    id: 5,
    title: "Farm Mechanization Support",
    agency: "Ministry of Agriculture & Farmers Welfare",
    description: "Financial assistance of up to 50% of the cost of agricultural machinery and equipment to small farmers.",
    deadline: "Jan 15, 2024",
    category: "Subsidy",
    type: "subsidy",
    icon: <Tractor className="h-6 w-6" />
  },
  {
    id: 6,
    title: "Agri-Startup Innovation Fund",
    agency: "Entrepreneurship Development Institute",
    description: "Seed funding and mentorship for agricultural startups developing innovative farming solutions.",
    deadline: "Rolling Applications",
    category: "Grant",
    type: "grant",
    icon: <Sprout className="h-6 w-6" />
  },
  {
    id: 7,
    title: "Rural Agricultural Credit Scheme",
    agency: "National Bank for Agriculture",
    description: "Special credit line with reduced interest rates for small and marginal farmers in rural areas.",
    deadline: "Ongoing",
    category: "Loan",
    type: "loan",
    icon: <CreditCard className="h-6 w-6" />
  },
  {
    id: 8,
    title: "Organic Farming Certification Subsidy",
    agency: "Organic Products Certification Authority",
    description: "Covers 75% of the cost for organic certification to encourage farmers to switch to organic production.",
    deadline: "Mar 31, 2024",
    category: "Subsidy",
    type: "subsidy",
    icon: <Sprout className="h-6 w-6" />
  }
];

const GovernmentSchemes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        scheme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        scheme.agency.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = activeTab === "all" || scheme.type === activeTab;
    
    return matchesSearch && matchesType;
  });

  return (
    <Layout>
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-down">
            <h1 className="text-4xl font-semibold mb-4">Government Schemes & Loans</h1>
            <p className="text-lg text-muted-foreground">
              Discover the latest agricultural support programs, subsidies, and loan offers
            </p>
          </div>
          
          <div className="mb-10 max-w-3xl mx-auto animate-fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="search"
                placeholder="Search for schemes, loans, or agencies..."
                className="pl-10 pr-10 py-6 h-14 rounded-full border border-border/60 focus:border-primary bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  <span className="sr-only">Clear</span>
                  <span aria-hidden="true">×</span>
                </Button>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-center">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="all" className="px-6">All</TabsTrigger>
                  <TabsTrigger value="subsidy" className="px-6">Subsidies</TabsTrigger>
                  <TabsTrigger value="loan" className="px-6">Loans</TabsTrigger>
                  <TabsTrigger value="grant" className="px-6">Grants</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="all">
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  {filteredSchemes.length > 0 ? (
                    filteredSchemes.map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        title={scheme.title}
                        agency={scheme.agency}
                        description={scheme.description}
                        deadline={scheme.deadline}
                        category={scheme.category}
                        icon={scheme.icon}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 py-20 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Schemes Found</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        We couldn't find any schemes matching your search criteria. Try adjusting your search or check back later.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="subsidy">
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  {filteredSchemes.length > 0 ? (
                    filteredSchemes.map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        title={scheme.title}
                        agency={scheme.agency}
                        description={scheme.description}
                        deadline={scheme.deadline}
                        category={scheme.category}
                        icon={scheme.icon}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 py-20 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Subsidies Found</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        We couldn't find any subsidies matching your search criteria. Try adjusting your search or check back later.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="loan">
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  {filteredSchemes.length > 0 ? (
                    filteredSchemes.map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        title={scheme.title}
                        agency={scheme.agency}
                        description={scheme.description}
                        deadline={scheme.deadline}
                        category={scheme.category}
                        icon={scheme.icon}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 py-20 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Loans Found</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        We couldn't find any loans matching your search criteria. Try adjusting your search or check back later.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="grant">
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  {filteredSchemes.length > 0 ? (
                    filteredSchemes.map((scheme) => (
                      <SchemeCard
                        key={scheme.id}
                        title={scheme.title}
                        agency={scheme.agency}
                        description={scheme.description}
                        deadline={scheme.deadline}
                        category={scheme.category}
                        icon={scheme.icon}
                      />
                    ))
                  ) : (
                    <div className="col-span-2 py-20 text-center">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No Grants Found</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        We couldn't find any grants matching your search criteria. Try adjusting your search or check back later.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto bg-muted/30 border border-border/40 rounded-xl p-6 text-center">
            <h3 className="text-xl font-medium mb-2">Need Help With Applications?</h3>
            <p className="text-muted-foreground mb-4">
              Our experts can guide you through the application process for any of the schemes listed above.
            </p>
            <Button className="rounded-full">Get Application Assistance</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GovernmentSchemes;
