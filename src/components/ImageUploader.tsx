import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { X, Check, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageAnalyzed: (result: AnalysisResult) => void;
}

interface AnalysisResult {
  health: number;
  disease: string | null;
  recommendations: string[];
  confidence: number;
}

const ImageUploader = ({ onImageAnalyzed }: ImageUploaderProps) => {
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const healthLink = "https://plant-disease-prediction-c06mqzrkoxr.streamlit.app/";

  const handleButtonClick = () => {
    window.open(healthLink, "_blank");
  };

  const removeImage = () => {
    setImage(null);
  };

  const analyzeImage = () => {
    if (!image) return;

    setIsAnalyzing(true);
    toast({
      title: "Analyzing image...",
      description: "Please wait while we assess your crop's health.",
    });

    // Simulate an API call
    setTimeout(() => {
      const mockResult: AnalysisResult = {
        health: Math.random() * 30 + 70,
        disease: Math.random() > 0.7 ? "Leaf Rust" : null,
        recommendations: [
          "Ensure adequate irrigation every 3-4 days",
          "Apply nitrogen-rich fertilizer",
          "Monitor for signs of pest activity",
        ],
        confidence: Math.random() * 10 + 85,
      };

      onImageAnalyzed(mockResult);
      setIsAnalyzing(false);

      toast({
        title: "Analysis Complete",
        description: "We've completed the health assessment of your crop.",
      });
    }, 3000);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8 bg-cover bg-center"
      style={{
        backgroundImage: "url('https://e1.pxfuel.com/desktop-wallpaper/427/375/desktop-wallpaper-for-dark-green-grass-backgrounds-green-grass-background.jpg')",
      }}
    >
      {!image ? (
        <Button
          onClick={handleButtonClick}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Check Crop Health
        </Button>
      ) : (
        <div className="border rounded-xl p-4 bg-background backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Uploaded Image</h3>
            <Button variant="ghost" size="icon" onClick={removeImage}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="rounded-lg overflow-hidden mb-4 aspect-video w-full flex items-center justify-center bg-muted/40">
            <img
              src={image}
              alt="Uploaded crop"
              className="object-cover max-w-full max-h-full"
            />
          </div>
          <Button onClick={analyzeImage} className="w-full" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Analyze Crop Health
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
