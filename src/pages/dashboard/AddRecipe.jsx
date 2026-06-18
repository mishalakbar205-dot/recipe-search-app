import { useState, useEffect } from "react";
import {api} from '../../utils/api';
import { endpoints } from "../../config/endpoints";

export default function AddRecipe(){
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileKey, setFileKey] = useState(Date.now());

    // fetch categories only
    useEffect(() =>{
        const fetchCategories = async () => {
            const res = await api.get(endpoints.categories.base);
            setCategories(res.data || []);
        };
        fetchCategories();
    }, []);

    useEffect(() =>{
        return () =>{
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const onSelectImageFile = (e) =>{
        const file = e.target.files?.[0];
        setImageFile(file || null);
        if(previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(file ? URL.createObjectURL(file) : null);
    }
    const clearSelectedImage = () =>{
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setImageFile(null);
        setFileKey(Date.now());
    };

    const addRecipe = async () =>{
         if (!name.trim()) return;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("ingredients", ingredients);
      formData.append("instructions", instructions);
      if (imageFile) formData.append("image", imageFile);
      formData.append("categories", JSON.stringify(selectedCategories));

      await api.post(endpoints.recipes.base, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Recipe added successfully!");
      // reset form
      setName("");
      setIngredients("");
      setInstructions("");
      setSelectedCategories([]);
      clearSelectedImage();
    } catch (err) {
      console.error("Add recipe failed:", err);
      alert("❌ Add recipe failed.");
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 mb-10 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold mb-4 text-green-600">➕ Add New Recipe</h2>
      <div className="grid gap-5 ">
        <input
          type="text"
          placeholder="Recipe name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
        />

        <input
          key={fileKey}
          type="file"
          accept="image/*"
          onChange={onSelectImageFile}
          className="border rounded-lg px-4 py-2 w-full cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-300 outline-none"
        />

        {previewUrl && (
          <div className="flex items-center gap-4">
            <img src={previewUrl} alt="preview" className="w-28 h-28 object-cover rounded-xl border shadow-md" />
            <button type="button" onClick={clearSelectedImage} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow">
              ❌ Remove
            </button>
          </div>
        )}

        <input
          type="text"
          placeholder="Ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
        />

        <textarea
          placeholder="Instructions"
          rows="4"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-400 outline-none"
        />

         {/* Categories Checkboxes */}
        <div>
          <p className="font-semibold mb-2 text-green-700 dark:text-green-400">Select Categories:</p>
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <label key={cat._id} className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer transition">
                <input
                  type="checkbox"
                  value={cat.name}
                  checked={selectedCategories.includes(cat.name)}
                  onChange={(e) =>
                    setSelectedCategories(
                      e.target.checked
                        ? [...selectedCategories, cat.name]
                        : selectedCategories.filter((c) => c !== cat.name)
                    )
                  }
                />
                <span className="text-gray-700 dark:text-gray-200"> {cat.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button onClick={addRecipe} className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-transform transform hover:scale-105 w-fit">
          ➕ Add Recipe
        </button>
      </div>
    </div>
    </div>
  );
}
    

