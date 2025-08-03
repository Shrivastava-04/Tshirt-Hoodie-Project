// client/src/components/admin/AdminSidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png"; // Assuming you use the same logo
import { useAuth } from "@/context/AuthCotext"; // To access logout

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth(); // Get logout function

  const navLinks = [
    { name: "Dashboard", icon: LayoutDashboard, tab: "dashboard" },
    { name: "Users", icon: Users, tab: "users" },
    { name: "Products", icon: Package, tab: "products" },
    { name: "Add Product", icon: PlusCircle, tab: "addProduct" },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-background/95 border-r border-border/40 p-4 flex flex-col z-40">
      {/* Logo & Title */}
      <div className="flex items-center space-x-2 mb-8 mt-2">
        <img src={logo} alt="Arrasté" className="h-9 w-9" />
        <span className="text-2xl font-bold gradient-text">Arrasté Admin</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {navLinks.map((link) => (
          <Button
            key={link.tab}
            variant={activeTab === link.tab ? "secondary" : "ghost"}
            className={`w-full justify-start text-lg font-medium ${
              activeTab === link.tab
                ? "bg-accent/20 text-accent"
                : "text-foreground/80 hover:text-accent"
            }`}
            onClick={() => setActiveTab(link.tab)}
          >
            <link.icon className="h-5 w-5 mr-3" />
            {link.name}
          </Button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-border/40">
        <Button
          variant="destructive"
          className="w-full text-lg"
          onClick={logout} // Call logout from AuthContext
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
