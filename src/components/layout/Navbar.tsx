import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Users, Receipt, CreditCard, TrendingUp } from "lucide-react";
import { useAppContext } from "../../context/AppContext";
import logo from "../../assets/logo.png";
import WalletConnect from "../ui/WalletConnect";

const Navbar = () => {
  const { getEzPoints } = useAppContext();
  const location = useLocation();

  const navItems = [
    { name: "Account", path: "/", icon: CreditCard },
    { name: "Friends", path: "/friends", icon: Users },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="S3EZ Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1 absolute left-1/2 transform -translate-x-1/2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? "text-gray-900 bg-gray-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <div className="bg-gray-100 rounded-full px-4 py-1.5 text-sm font-medium text-gray-700">
              {getEzPoints()} ezPoints
            </div>
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
