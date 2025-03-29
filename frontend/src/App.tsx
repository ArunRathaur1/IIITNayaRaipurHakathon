import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PriceEstimation from "./pages/PriceEstimation";
import GovernmentSchemes from "./pages/GovernmentSchemes";
import CropHealth from "./pages/CropHealth";
import DirectMarket from "./pages/DirectMarket";
import Landselling from "./pages/Landselling";
import SellerManagement from "./pages/SellerManagement";
import FarmerForm from "./pages/FarmerForm";
import WeatherDashboard from "./components/Wether/wether";
import FarmerDetails from "./pages/FarmerDetails";
import Sarthi from "./pages/Sarthi";
import FloatingChatbot from "./pages/Sarthi";
import UpdateCrop from "./pages/UpdateCrop";
import Workplace from "./pages/workplace";
const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="agri-aide-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/price-estimation" element={<PriceEstimation />} />
            <Route path="/government-schemes" element={<GovernmentSchemes />} />
            <Route path="/crop-health" element={<CropHealth />} />
            <Route path="/direct-market" element={<DirectMarket />} />
            <Route path="/landselling" element={<Landselling />} />
            <Route path="/sellermanagement" element={<SellerManagement />} />
            <Route path="/wether" element={<WeatherDashboard />} />
            <Route path="/farmerform" element={<FarmerForm />} />
            <Route path="/details/:phone" element={<FarmerDetails />} />
            <Route path="/sarthi" element={<Sarthi />} />
            {/* <Route path="/cropupdate" element={<UpdateCrop cropId={""} updatedCropData={undefined} />} /> */}
            <Route path="/updatecrop" element={<UpdateCrop />}/>
            <Route path='/workplace' element={<Workplace></Workplace>}></Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <FloatingChatbot />
        {/* Replace the simple button with the chatbot component */}
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
