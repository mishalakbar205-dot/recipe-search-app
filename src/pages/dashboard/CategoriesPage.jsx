import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {api} from '../../utils/api';
import { endpoints } from "../../config/endpoints";

export default function CategoriesPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal (Add Category)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);

  // Edit states
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(endpoints.categories.base);
      setCategories(res.data || []);
    } catch (err) {
      console.error("Fetch categories failed:", err);
      setError("Failed to load categories.");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      setSaving(true);
      await api.post(endpoints.categories.base, { name: newCategory.trim() });
      setNewCategory("");
      setIsModalOpen(false);
      await fetchCategories();
    } catch (err) {
      console.error("Add category failed:", err);
      setError("Add category failed. See console.");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setSaving(false);
    }
  };

  const startEditCategory = (id, name) => {
    setEditCategoryId(id);
    setEditCategoryName(name);
  };

  const updateCategory = async () => {
    if (!editCategoryName.trim()) return;
    try {
      await api.put(`${endpoints.categories.base}/${editCategoryId}`, { name: editCategoryName.trim() });
      setEditCategoryId(null);
      setEditCategoryName("");
      await fetchCategories();
    } catch (err) {
      console.error("Update category failed:", err);
      setError("Update category failed. See console.");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`${endpoints.categories.base}/${id}`);
      await fetchCategories();
    } catch (err) {
      console.error("Delete category failed:", err);
      setError("Delete category failed. See console.");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Manage Categories
      </h2>

      {error && (
        <p className="text-red-600 mb-6 bg-red-100 dark:bg-red-900/40 dark:text-red-300 p-3 rounded-lg shadow">
          {error}
        </p>
      )}
      {loading && <p className="mb-4 text-gray-500">Loading categories...</p>}

      {/* Add Category Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl shadow font-medium transition-transform transform hover:scale-105"
      >
        ➕ Add Category
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              Add New Category
            </h3>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category name"
              className="w-full border rounded-lg px-4 py-2 mb-4 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-green-400 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") addCategory();
              }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={addCategory}
                disabled={saving}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="mt-6 overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl border border-gray-100 dark:border-gray-700">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 dark:bg-blue-900/40 text-gray-700 dark:text-gray-200">
              <th className="px-4 py-3 border dark:border-gray-700 text-center ">#</th>
              <th className="px-4 py-3 border dark:border-gray-700 text-center">Name</th>
              <th className="px-4 py-3 border dark:border-gray-700 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr
                key={cat._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition text-gray-100"
              >
                <td className="px-4 py-2 border dark:border-gray-700 text-center">{index + 1}</td>
                <td className="px-4 py-2 border dark:border-gray-700 text-center">
                  {editCategoryId === cat._id ? (
                    <input
                      className="border rounded px-2 py-1 w-full dark:bg-gray-700  dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") updateCategory();
                      }}
                    />
                  ) : (
                    Array.isArray(cat.name) ? cat.name.join(", ") : cat.name
                  )}
                </td>
                <td className="px-4 py-2 border dark:border-gray-700 text-center">
                  {editCategoryId === cat._id ? (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={updateCategory}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditCategoryId(null);
                          setEditCategoryName("");
                        }}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => startEditCategory(cat._id, cat.name)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteCategory(cat._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {categories.length === 0 && !loading && (
              <tr>
                <td
                  className="px-4 py-6 border dark:border-gray-700 text-center text-gray-500 dark:text-gray-400"
                  colSpan={3}
                >
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
