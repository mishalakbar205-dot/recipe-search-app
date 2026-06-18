import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header"
import ProtectedRoute from './components/ProtectedRoute';
import Footer from "./components/Footer"
import AllRecipes from './pages/AllRecipes';
import Home from "./pages/Home"
import SearchResults from "./pages/SearchResults"
import RecipeDetail from "./pages/RecipeDetail"
import Categories from './pages/Categories';
//import Dashboard from './pages/Dashboard';
import DashboardLayout from './pages/dashboard/DashboardLayout';
//import RecipesPage from './pages/dashboard/RecipesPage';
import RecipesList from './pages/dashboard/RecipeList';
import AddRecipe from './pages/dashboard/AddRecipe';
import CategoriesPage from './pages/dashboard/CategoriesPage';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


function App() {

  return (
    <>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <Header />
            <main className="min-h-[80vh]">
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/categories' element={<Categories />} />
                 <Route path="/categories/:name" element = {<SearchResults/>}/>
                <Route path='/search' element={<SearchResults />} />
                <Route path='/recipe/:id' element={<RecipeDetail />} />
                <Route path='/recipes' element={<AllRecipes />} />
                <Route element={<ProtectedRoute requireAdmin={true} />}>
                  <Route path="/dashboard" element={<DashboardLayout />}>
                                {/* Recipes Section */}
                    <Route path="recipes" element={<RecipesList />} />
                    <Route path="recipes/add" element = {<AddRecipe/>}/>
                                  {/* Categories Section */}
                    <Route path="categories" element={<CategoriesPage />} />
                  </Route>
                </Route>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position= "top-right" autoClose = {3000}/>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
      
    </>
    
  );
}
console.log("VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);


export default App
