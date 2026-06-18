import { useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import { getImageUrl } from "../utils/imageUrl";
import { endpoints } from "../config/endpoints";
import { api } from "../utils/api";
import RecipeCard from "../components/RecipeCard";
import { Link } from "react-router-dom";

function RecipeDetail() {
  const { id } = useParams();
  console.log("RecipeDetail param id:", id);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [suggestedRecipes, setSuggestedRecipes] = useState([]); 

  useEffect(() => {
    async function load() {
      if (!id) {
        setError("Missing recipe id.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`${endpoints.recipes.base}/${id}`);
        const data = res.data;
        setRecipe(data);

        // get suggestions
        if(data.categories && data.categories.length > 0){
          const lastCategory = data.categories[data.categories.length - 1];
          const categoryName = lastCategory?.name;

          if (categoryName){
            const catRes = await api.get(`${endpoints.recipes.base}?category=${encodeURIComponent(categoryName)}`);
            const catData = catRes.data;

            // remove current recipes
            const others = catData.filter(r => r._id !== data._id);
            setSuggestedRecipes(others);
          }
        }
    }
    catch(error){
      setError(error.message || "Failed to fetch recipe. ")
    }
    finally{
      setLoading(false);
    }
  }
  load();
  }, [id]);

  if (loading) return <p className="text-center text-xl mt-20">Loading...</p>;
  if (error) return <div className="text-center text-red-600 font-medium mt-20">Error: {error}</div>;
  if (!recipe) return <p className="text-center text-gray-600 mt-20">Recipe not found!</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 py-12 px-4">
      <div className="container mx-auto p-8 md:p-12 
                      bg-gray-200 backdrop-blur-md rounded-2xl shadow-2xl">
        <div className="flex flex-col md:flex-row gap-10">
          
          {/* Left: Image */}
          <div className="flex-1">
            <img
              src={getImageUrl(recipe.image)}
              alt={recipe.name}
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div> 

          {/* Right: Text */}
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold mb-4 text-gray-900">{recipe.name}</h2>
            
            <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-1 rounded-full mb-6">
              {recipe.cuisine}
            </span>

            {recipe.categories && recipe.categories.length > 0 &&  (
              <div className="mb-6">
                {recipe.categories.map((cat) => (
                  <Link
                  key={cat._id}
                  to={`/categories/${cat.name}`}
                  className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-4 py-1 rounded-full mr-2 mb-2"
                  >
                    {cat.name}
                     </Link>
                 
                ))}

              </div>
            )}


            <h5 className="text-xl font-semibold mt-6 mb-3 text-gray-800">Ingredients</h5>
            <ul className="space-y-2 mb-6">
              {recipe.ingredients?.map((item, i) => (
                <li key={i} className="flex items-center text-gray-700">
                  <span className="text-green-500 mr-2">✓</span> {item}
                </li>
              ))}
            </ul>

            <h5 className="text-xl font-semibold mt-6 mb-3 text-gray-800">Instructions</h5>
            <p className="text-gray-700 leading-relaxed bg-white/50 backdrop-blur-sm p-4 rounded-lg border">
              {recipe.instructions}
            </p>
          </div>
        </div>
      </div>
    
                  {suggestedRecipes.length > 0 && (
                    <div className="container mx-auto mt-12 px-4">
                      <h2 className="text-2xl font-semibold mb-6 text-center">You might also like</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {suggestedRecipes.map((r) => (
                          <RecipeCard
                          key={r._id}
                          recipe={{
                            id : r._id,
                            name: r.name,
                            image: r.image,
                            category: r.categories?.[r.categories.length - 1]?.name || "Uncategorized"
                          }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
    </div>
  );
}

export default RecipeDetail;
