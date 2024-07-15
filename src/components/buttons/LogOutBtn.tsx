import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

const LogoutButton: React.FC = ({ className }: { className?: string }) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }

  const { logout } = authContext;

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className={cn(className, "flex items-center gap-2")}
    >
      <LogOut size={16} />
      Logout
    </Button>
  );
};

export default LogoutButton;
