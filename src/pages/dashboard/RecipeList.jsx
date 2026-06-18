import { useState, useEffect } from "react";
import { getImageUrl } from "../../utils/imageUrl";
import { Link } from "react-router-dom"
import {api} from "../../utils/api";
import { endpoints } from "../../config/endpoints";

export default function RecipesList() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);


  const [editRecipeId, setEditRecipeId] = useState(null);
  const [editRecipeName, setEditRecipeName] = useState("");
  const [editRecipeImage, setEditRecipeImage] = useState(null);
  const [editSelectedCategories, setEditSelectedCategories] = useState([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recipesData, categoriesData] = await Promise.all([
        api.get(endpoints.recipes.base),
        api.get(endpoints.categories.base),
      ]);
      setRecipes(recipesData.data || []);
      setCategories(categoriesData.data || []);
    } catch (err) {
      setError("Failed to load recipes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    return () => {
      if (editPreviewUrl) {
        URL.revokeObjectURL(editPreviewUrl)
      }
    };
  }, [editPreviewUrl]);


  const deleteRecipe = async (id) => {
    if (!window.confirm("Delete this recipe?")) return;
    await api.delete(`${endpoints.recipes.base}/${id}`);
    fetchData();
  };

  const startEditRecipe = (recipe) => {
    // revoke previous preview if present
    if (editPreviewUrl) {
      URL.revokeObjectURL(editPreviewUrl)
    }
    setEditRecipeId(recipe._id);
    setEditRecipeName(recipe.name);
    setEditSelectedCategories(recipe.categories?.map((c) => c.name || c) || []);
    setEditRecipeImage(null);
    setEditPreviewUrl(null);
  };

  const updateRecipe = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editRecipeName);
      formData.append("categories", JSON.stringify(editSelectedCategories));
      if (editRecipeImage) {
        formData.append("image", editRecipeImage);
      }
      await api.put(`${endpoints.recipes.base}/${editRecipeId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset edit mode
      setEditRecipeId(null);
      setEditRecipeName("");
      setEditSelectedCategories([]);
      setEditRecipeImage(null);

      // Refresh table data
      fetchData();
    }
    catch (error) {
      console.error("Error updating recipe: ", error)
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with title + button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          🍴 Manage Recipes
        </h2>
        <Link
          to="/dashboard/recipes/add"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 w-fit"
        >
          ➕ New Recipe
        </Link>
      </div>

      {error && (
        <p className="text-red-600 mb-6 bg-red-100 dark:bg-red-900/40 p-3 rounded-lg shadow-md border border-red-200 dark:border-red-700">
          {error}
        </p>
      )}
      {loading && (
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Loading recipes...
        </p>
      )}

      {/* Table */}
      <div className="mt-6 overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 dark:bg-blue-900/40 text-gray-700 dark:text-gray-200">
              <th className="px-4 py-3 border dark:border-gray-700 text-center">Image</th>
              <th className="px-4 py-3 border dark:border-gray-700 text-center">Name</th>
              <th className="px-4 py-3 border dark:border-gray-700 text-center">Categories</th>
              <th className="px-4 py-3 border dark:border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => (
              <tr
                key={recipe._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition text-gray-100"
              >
                {/* Image */}
                <td className="px-4 py-2 border dark:border-gray-700 text-center">
                  {editRecipeId === recipe._id ? (
                    <div className="flex flex-col items-center gap-2">
                      {/* Hidden File Input */}
                      <input
                        type="file"
                        accept="image/*"
                        id={`file-${recipe._id}`}
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setEditRecipeImage(file || null);

                          if (editPreviewUrl) {
                            URL.revokeObjectURL(editPreviewUrl);
                          }
                          if (file) {
                            setEditPreviewUrl(URL.createObjectURL(file));
                          } else {
                            setEditPreviewUrl(null);
                          }
                        }}
                      />

                      {/* Image Preview or Existing Image */}
                      <div className="relative inline-block">
                        {editPreviewUrl ? (
                          <img
                            src={editPreviewUrl}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg shadow border"
                          />
                        ) : recipe.image ? (
                          <img
                            src={getImageUrl(recipe.image)}
                            alt={recipe.name}
                            className="w-16 h-16 object-cover rounded-lg shadow border"
                          />
                        ) : (
                          <span className="text-gray-400 italic">No image</span>
                        )}

                        {/* Red ❌ remove button */}
                        {editPreviewUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              URL.revokeObjectURL(editPreviewUrl);
                              setEditPreviewUrl(null);
                              setEditRecipeImage(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-700"
                          >
                            ✕
                          </button>
                        )}

                        {/* ✏️ Pencil edit button */}
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById(`file-${recipe._id}`).click()
                          }
                          className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-blue-600"
                        >
                          ✎
                        </button>
                      </div>
                    </div>
                  ) : recipe.image ? (
                    <img
                      src={getImageUrl(recipe.image)}
                      alt={recipe.name}
                      className="w-16 h-16 object-cover rounded-lg mx-auto shadow"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>

                {/*Name */}
                <td className="px-4 py-2 border dark:border-gray-700 text-center">
                  {editRecipeId === recipe._id ? (
                    <input
                      className="border rounded px-2 py-1 w-full dark:bg-gray-700 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={editRecipeName}
                      onChange={(e) => setEditRecipeName(e.target.value)}
                    />
                  ) : (
                    <span className="font-medium text-gray-800 dark:text-gray-100">
                      {recipe.name}
                    </span>
                  )}
                </td>
                {/* Categories */}
                <td className="px-4 py-2 border dark:border-gray-700 text-center">
                  {editRecipeId === recipe._id ? (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {categories.map((cat) => (
                        <label
                          key={cat._id}
                          className="flex items-center gap-1 border rounded px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            value={cat.name}
                            checked={editSelectedCategories.includes(cat.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditSelectedCategories([
                                  ...editSelectedCategories,
                                  cat.name,
                                ]);
                              } else {
                                setEditSelectedCategories(
                                  editSelectedCategories.filter(
                                    (c) => c !== cat.name
                                  )
                                );
                              }
                            }}
                          />
                          <span className="text-gray-700 dark:text-gray-200">
                            {cat.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <span className="text-gray-700 dark:text-gray-300">
                      {recipe.categories?.map((c) => c.name || c).join(", ")}
                    </span>
                  )}
                </td>
                {/* Actions */}
                <td className="px-4 py-2 border dark:border-gray-700 text-center">
                  {editRecipeId === recipe._id ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={updateRecipe}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditRecipeId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => startEditRecipe(recipe)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteRecipe(recipe._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {/* Empty state */}
            {recipes.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 border dark:border-gray-700 text-center text-gray-500 dark:text-gray-400"
                >
                  No recipes found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
