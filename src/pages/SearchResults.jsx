import { useLocation } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { useState, useEffect } from "react";
import { endpoints } from "../config/endpoints";
import { useParams } from "react-router-dom";

function SearchResults() {
  const location = useLocation();
  const {name} = useParams();
  const params = new URLSearchParams(location.search);
  const query = params.get("query") || "";
  const category = params.get("category") || "";

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  
  

  useEffect(() => {
    if (!query && !category) return;
    setLoading(true);
    
    let url = endpoints.recipes.base;
    if(query) {
      url += `?search=${encodeURIComponent(query)}`;
    }
    else if (category){
      url+= `?category=${encodeURIComponent(category)}`;
    }
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching", error);
        setLoading(false);
      });
  }, [query, category]);

  return (
    <div className="bg-gradient-to-b from-gray-50 via-gray-100 to-gray-200 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-10 text-center">
         {query? (
          <>
          Search Results for <span className="text-blue-600">"{query}"</span>
          </>
          )
          : category
          ? (
            <>
            Recipes in <span className="text-green-600">"{category}"</span> category
            </>
          )
          : "All Recipes"
        }
        </h2>

        {/* Content */}
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading...</p>
        ) : recipes.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No recipes found!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={{
                  id: recipe._id,
                  name: recipe.name,
                  image: recipe.image,
                  category: recipe.cuisine,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;




