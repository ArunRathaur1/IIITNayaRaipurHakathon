
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface LoginFormProps {
  phoneInput: string;
  setPhoneInput: (value: string) => void;
  handleLogin: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  phoneInput,
  setPhoneInput,
  handleLogin
}) => {
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
          <Phone size={16} />
        </div>
        <Input
          type="text"
          placeholder="Enter Phone Number"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          required
          className="pl-10 bg-background/50"
        />
      </div>
      <Button type="submit" variant="secondary" className="w-full">View My Details</Button>
    </form>
  );
};

export default LoginForm;
