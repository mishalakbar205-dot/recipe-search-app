import { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import { endpoints } from "../config/endpoints";

function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetch(endpoints.recipes.base)
      .then(res => res.json())
      .then(data => {
        setRecipes(data);
        setLoading(false);
      })
      .catch(error => {
        console.log("Error fetching recipes:", error);
        setLoading(false);
      });
  }, []);

  // Pagination calculations
  const total = recipes.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const currentRecipes = recipes.slice(startIndex, startIndex + limit);

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  if (loading) return <p className="text-center text-xl mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 py-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        
        {/* Page Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 tracking-tight">
          All Recipes
        </h2>

        {/* Recipes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {currentRecipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden 
                         hover:shadow-xl transform hover:-translate-y-1 
                         transition duration-300"
            >
              <RecipeCard recipe={recipe} />
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-12 gap-3">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition shadow-sm"
          >
            Prev
          </button>

          {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-4 py-2 rounded-full shadow-sm transition ${
                i + 1 === page
                  ? "bg-blue-500 text-white shadow"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-full bg-gray-200 disabled:opacity-50 hover:bg-gray-300 transition shadow-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AllRecipes;
