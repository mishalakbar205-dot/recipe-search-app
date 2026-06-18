import { Link } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

function RecipeCard({ recipe }) {
  const recipeId = recipe._id || recipe.id;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
      <img
        src={getImageUrl(recipe.image)}
        alt={recipe.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h5 className="text-lg font-semibold text-gray-800">{recipe.name}</h5>
        <Link
          to={`/recipe/${recipeId}`}
          className="inline-block mt-2 text-blue-600 font-medium hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default RecipeCard;
