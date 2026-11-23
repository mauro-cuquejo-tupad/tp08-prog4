import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/categorias" && (location.pathname === "/" || location.pathname === "/categorias")) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Gestor Gastronómico
            </span>
          </div>
          <div className="flex space-x-4">
            <Link
              to="/categorias"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/categorias")
                  ? "bg-slate-800 text-blue-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Categorías
            </Link>
            <Link
              to="/productos"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/productos")
                  ? "bg-slate-800 text-blue-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Productos
            </Link>
            <Link
              to="/ingredientes"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/ingredientes")
                  ? "bg-slate-800 text-blue-400"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Ingredientes
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
