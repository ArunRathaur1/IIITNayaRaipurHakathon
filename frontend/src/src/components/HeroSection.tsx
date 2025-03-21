import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
//iuiuiuiuu
const HeroSection = () => {
  return (
    <div className="relative min-h-[90vh] flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&auto=format&fit=crop&q=20')] bg-cover bg-center opacity-5"></div>
        <div className="absolute right-0 bottom-0 w-1/3 h-1/3 bg-gradient-to-tl from-agri-green/20 to-transparent rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute left-0 top-0 w-1/3 h-1/3 bg-gradient-to-br from-agri-blue/20 to-transparent rounded-full blur-3xl transform -translate-x-1/4 -translate-y-1/4"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Revolutionizing Agriculture with AI
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight">
                Empowering Farmers with{" "}
                <span className="text-primary">Smart Technology</span>
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl">
                Leverage AI to estimate crop prices, monitor crop health, access
                government schemes, and connect directly with consumers.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                asChild
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link to="/price-estimation">
                  Try Price Estimation <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="rounded-full"
              >
                <Link to="/crop-health">Check Crop Health</Link>
              </Button>
            </div>

            <div className="flex items-center gap-x-8 gap-y-4 flex-wrap">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1607990283143-e81e7a2c9349?w=100&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=100&auto=format&fit=crop&q=60",
                  "https://images.unsplash.com/photo-1622281953819-e1b36b928122?w=100&auto=format&fit=crop&q=60",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-background overflow-hidden"
                  >
                    <img
                      src={src}
                      alt={`User ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">1,000+</span>{" "}
                farmers using our platform
              </p>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?w=800&auto=format&fit=crop&q=80"
                alt="Farmer with technology"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-agri-green/10 to-agri-blue/10"></div>
              <div className="glass-panel rounded-2xl p-6 shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 animate-float">
                <div className="space-y-4">
                  <div className="w-full h-32 bg-agri-green/10 rounded-lg flex items-center justify-center">
                    <img
                      src="https://www.researchgate.net/publication/384359907/figure/fig1/AS:11431281280471750@1727377705133/The-proposed-abnormal-price-detection-system-estimates-price-distribution-considering.tif"
                      alt="Crop Analysis"
                      // className="w-24 h-24 rounded-full object-cover"
                    />
                  </div>
                  <div className="space-y-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
