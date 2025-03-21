
import { BarChart, TrendingUp, LineChart, DollarSign } from 'lucide-react';
import Layout from '@/components/Layout';
import PriceCalculator from '@/components/PriceCalculator';
import RotatingCube from '@/components/RotatingCube';

const PriceEstimation = () => {
  return (
    <Layout>
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 z-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1503139739043-2a47d2f1fea1?w=1920&auto=format&fit=crop&q=20" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-down">
            <h1 className="text-4xl font-semibold mb-4">Crop Price Estimation</h1>
            <p className="text-lg text-muted-foreground">
              Use our AI-powered tool to estimate the market price of your crops based on various factors
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <h2 className="text-2xl font-medium mb-6">How It Works</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Market Analysis</h3>
                    <p className="text-muted-foreground">
                      Our AI analyzes current and historical market data to establish baseline pricing trends.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <BarChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Resource Evaluation</h3>
                    <p className="text-muted-foreground">
                      We factor in your land size, water availability, and soil type to refine the estimate.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <LineChart className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Yield Prediction</h3>
                    <p className="text-muted-foreground">
                      The system predicts your potential yield quality based on the provided information.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Price Range Generation</h3>
                    <p className="text-muted-foreground">
                      You receive a comprehensive price range with minimum, average, and maximum estimates.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-5 rounded-xl bg-muted/50 border border-border/50 relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 opacity-50">
                  <RotatingCube />
                </div>
                <h3 className="font-medium mb-3">Did you know?</h3>
                <p className="text-sm text-muted-foreground">
                  Farmers who use price estimation tools can increase their profit margins by up to 15% by timing their market entry more strategically.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center animate-fade-in">
              <PriceCalculator />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PriceEstimation;
