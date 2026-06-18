import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { endpoints } from "../config/endpoints";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(endpoints.categories.base)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data); 
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching Categories: ", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-xl mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 py-12">
      <div className="container mx-auto px-4 md:px-8 lg:px-16">

        {/* Page Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-gray-900 tracking-tight">
          🍽️ Browse Categories
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {categories.map((cat, index) => (
            <Link
              key={cat._id}
              to={`/search?category=${encodeURIComponent(cat.name.toLowerCase())}`}
              className={`
                rounded-2xl shadow-lg p-8 text-center 
                hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 
                transition duration-300 ease-in-out text-white
                ${index % 6 === 0 ? "bg-gradient-to-r from-purple-500 to-pink-400" : ""}
                ${index % 6 === 1 ? "bg-gradient-to-r from-blue-400 to-indigo-400" : ""}
                ${index % 6 === 2 ? "bg-gradient-to-r from-green-400 to-teal-500" : ""}
                ${index % 6 === 3 ? "bg-gradient-to-r from-orange-400 to-yellow-400" : ""}
                ${index % 6 === 4 ? "bg-gradient-to-r from-red-400 to-pink-500" : ""}
                ${index % 6 === 5 ? "bg-gradient-to-r from-cyan-400 to-sky-400" : ""}
              `}
            >
              <h3 className="text-2xl font-semibold mb-3 drop-shadow-lg">
                {cat.name}
              </h3>
              <p className="font-medium underline underline-offset-2">
                View Recipes →
              </p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Categories;
