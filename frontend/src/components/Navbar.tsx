
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, Cloud } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from "@/components/ThemeToggle";
import image from './logo.png';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    {name:"Sarthi", path:"/sarthi"},
    { name: 'Price Estimation', path: '/price-estimation' },
    { name: 'Government Schemes', path: '/government-schemes' },
    { name: 'Crop Health', path: '/crop-health' },
    { name: 'Direct Market', path: '/direct-market' },
    { name: 'Land', path: '/landselling' },
    { name: 'Weather', path: '/wether', icon: <Cloud className="w-4 h-4 mr-1" /> },
    { name: 'Login', path: '/farmerform' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                <img src={image} alt="Description" />              </span>
              <span className="font-semibold hidden md:inline-block">
                KrishiHub
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                asChild
                className={cn(
                  "px-4",
                  isActive(link.path) && "bg-accent text-accent-foreground"
                )}
              >
                <Link to={link.path} className="flex items-center">
                  {link.icon && link.icon}
                  {link.name}
                </Link>
              </Button>
            ))}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="ml-1"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden py-4 px-4 bg-background border-b border-border/40 animate-fade-in">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Button
                key={link.path}
                variant="ghost"
                asChild
                className={cn(
                  "justify-start",
                  isActive(link.path) && "bg-accent text-accent-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Link to={link.path} className="flex items-center">
                  {link.icon && link.icon}
                  {link.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
