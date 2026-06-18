import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";
// import Categories from "./Categories";
import { getImageUrl } from "../utils/imageUrl";
import { endpoints } from "../config/endpoints";

function Home() {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // fetch recipes for featured section
    fetch(endpoints.recipes.base)
      .then(res => res.json())
      .then(data => {
        const allRecipes = Array.isArray(data) ? data : data.recipes || [];
        setFeaturedRecipes(allRecipes.slice(0, 4));
        setLoading(false);
      })
      .catch(error => {
        console.log("Error fetching!", error);
        setLoading(false);
      });
       
    // fetch categories for browse categories
    fetch(endpoints.categories.base)
    .then(res =>res.json())
    .then(data =>{
      setCategories(data.slice(0,3));
    })
    .catch(error => console.log("Error fetching categories: ", error));
  }, []);

  if (loading) return <p className="text-center text-xl mt-20">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 ">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-200 via-orange-100 to-red-200 text-center py-24">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
          Discover Delicious Recipes
        </h1>
        <p className="text-lg md:text-2xl mb-8 text-gray-700">
          Cook, Share, and Enjoy Your Favorite Dishes
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/recipes"
            className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-700 transform hover:scale-105 transition"
          >
            Explore Recipes
          </Link>
          <Link
            to="/register"
            className="bg-white text-blue-600 border border-blue-600 px-8 py-4 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transform hover:scale-105 transition"
          >
            Join Now
          </Link>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        
        {/* Featured Recipes */}
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 tracking-tight">
          Featured Recipes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredRecipes.map(recipe => (
            <div
              key={recipe.id || recipe._id}
              className="bg-white/90 ring-1 ring-gray-200 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition"
            >
              <div className="relative">
                <img
                  src={getImageUrl(recipe.image)}
                  alt={recipe.name}
                  className="w-full h-52 object-cover"
                />
                <span className="absolute top-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-sm">
                  {recipe.cuisine}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{recipe.name}</h3>
                <Link
                  to={`/recipe/${recipe.id || recipe._id}`}
                  className="text-blue-700 font-medium hover:underline"
                >
                  View Recipe →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/recipes"
            className="text-blue-800 text-lg font-bold hover:underline transition"
          >
            View All Recipes →
          </Link>
        </div>

        {/* Categories Section */}
        <section className="mt-20">
          <h2 className="text-4xl font-bold mb-12 text-center text-gray-900 tracking-tight">
            Browse Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {categories.map((cat, index) => (
              <Link
                key={cat._id}
                to={`/search?query=${cat.name.toLowerCase()}`}
                className={`
                  rounded-2xl shadow-lg p-8 text-center
                  hover:shadow-2xl transform hover:translate-y-1 hover:scale-105
                  transition duration-300 ease-in-out text-white
                  ${index % 4 === 0 ? "bg-gradient-to-r from-purple-500 to-pink-400" : ""}
                  ${index %4 === 1 ? "bg-gradient-to-r from-blue-400 to-indigo-400" : ""}
                  ${index % 4 === 2 ? "bg-gradient-to-r from-red-400 to-pink-500" : ""}
                  `}
              >
                <h3 className="text-2xl font-semibold mb-3 drop-shadow-lg">{cat.name}</h3>
                <p className="text-blue-700 font-medium hover:underline">
                  View Recipes →
                </p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link 
            to= "/categories"
            className="text-blue-800 text-lg font-bold hover:underline transition"
            >
              View All Categories →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Home;
