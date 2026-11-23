import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CategoriasPage from "./pages/CategoriasPage";
import ProductsPage from "./pages/ProductsPage";
import IngredientesPage from "./pages/IngredientesPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<CategoriasPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/productos" element={<ProductsPage />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
