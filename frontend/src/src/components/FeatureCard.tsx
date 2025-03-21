
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  chip?: string;
  imageSrc?: string;
}

const FeatureCard = ({ icon, title, description, chip, imageSrc }: FeatureCardProps) => {
  return (
    <div className="glass-card group relative overflow-hidden h-full">
      {imageSrc && (
        <div className="absolute inset-0 z-0">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        </div>
      )}
      <div className="flex flex-col h-full relative z-10 p-6">
        {chip && (
          <div className="mb-4">
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">{chip}</span>
          </div>
        )}
        <div className="p-3 rounded-full bg-primary/10 w-fit mb-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground leading-relaxed flex-1">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
