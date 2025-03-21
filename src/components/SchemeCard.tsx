
import { ReactNode } from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SchemeCardProps {
  title: string;
  agency: string;
  description: string;
  deadline: string;
  category: string;
  icon: ReactNode;
  imageSrc?: string;
}

const SchemeCard = ({
  title,
  agency,
  description,
  deadline,
  category,
  icon,
  imageSrc
}: SchemeCardProps) => {
  return (
    <div className="glass-card group relative overflow-hidden">
      {imageSrc && (
        <div className="absolute inset-0 z-0">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>
      )}
      
      <div className="flex items-start gap-4 relative z-10">
        <div className="flex-shrink-0 p-3 rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
        
        <div className="space-y-3 flex-1">
          <div>
            <Badge variant="outline" className="mb-2">
              {category}
            </Badge>
            <h3 className="text-xl font-medium group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground">
              By {agency}
            </p>
          </div>
          
          <p className="text-muted-foreground line-clamp-2">
            {description}
          </p>
          
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1 opacity-70" />
              <span>Deadline: {deadline}</span>
            </div>
            
            <Button variant="ghost" size="sm" className="font-medium">
              View Details <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeCard;
