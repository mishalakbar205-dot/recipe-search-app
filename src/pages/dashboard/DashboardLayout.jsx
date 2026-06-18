import { Link, Outlet, useLocation } from "react-router-dom";
import { List, LayoutDashboard, BookOpen, Moon, Sun, LogOut, PlusCircle } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import {api} from "../../utils/api";
import { endpoints } from "../../config/endpoints";


export default function DashboardLayout(){
    const location = useLocation();
    const [darkMode, setDarkMode] = useContext(ThemeContext);

    const navItems = [
        {name: " All Recipes", path: "/dashboard/recipes", icon: <BookOpen size={18}/>},
        {name: "Add Recipe", path: "/dashboard/recipes/add", icon: <PlusCircle size={18}/>},
        {name: "Categories", path: "/dashboard/categories", icon: <List size={18}/>},
    ];

     // stats with real data
  const [ stats, setStats] = useState({
    totalRecipes: 0,
    categories: 0,
    recentlyAdded: 0,
  })

  const[loadingStats, setLoadingStats] = useState(false);
  const [statsError, setStatsError] = useState(null);

  useEffect(() =>{
    const fetchStats = async () => {
        try{
            setLoadingStats(true);
            setStatsError(null);

            // fetch recipes + categories
            const [recipesRes, categoriesRes] = await Promise.all([
                api.get(endpoints.recipes.base),
                api.get(endpoints.categories.base),

            ]);
            const recipes = Array.isArray(recipesRes.data) ? recipesRes.data : [];
            const categoriesArr = Array.isArray(categoriesRes.data) ? categoriesRes.data: [];

            // Counts
            const totalRecipes = recipes.length;
            const categoriesCount = categoriesArr.length;

            // recently added last 7 days
            const since = new Date();
            since.setDate(since.getDate() -7);
            const recentlyAdded = recipes.filter(
                r => r.createdAt && new Date(r.createdAt) >= since
            ).length;

            setStats({
                totalRecipes,
                categories: categoriesCount,
                recentlyAdded,
            });
        }
        catch(e){
            console.error("Stats fetch failed:", e);
            setStatsError("Failed to load stats");
        }
        finally{
            setLoadingStats(false);
        }
    };
    fetchStats();
  }, []);

  // Cards for rendering
  const statCards = [
    {title: "Total Recipes", value: loadingStats ? "..." : String(stats.totalRecipes), color: "from-blue-500 to-blue-400"},
    {title: "Categories", value: loadingStats ? "..." : String(stats.categories), color: "from-green-500 to-emerald-400"},
    {title: "Recently Added", value: loadingStats ? "..." : String(stats.recentlyAdded), color: "from-purple-500 to-indigo-400"},
    {title: "Quick Actions", value: "⚡", color: "from-rose-500 to-pink-400"}
  ]
    

    //const logout = () =>{
      //  localStorage.removeItem("token");
      //  navigate("/login");
   // };

    return(
        <div className="flex h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl flex flex-col rounded-r-xs">
            <div className="p-6 text-xl font-bold border-b border-white/20 flex items-center gap-2">
                <LayoutDashboard className="text-indigo-600"/> Admin Panel
            </div>
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) =>(
                        <li key={item.name}>
                            <Link
                            to={item.path}
                            className={ `flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition duration-200
                            ${
                                location.pathname === item.path
                                ? "bg-white/20 text-white shadow-md"
                      : "hover:bg-white/10 text-white/90"
                            } `}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                </nav>
                <div className="p-4 border-t border-white/20">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-red-500 hover:text-white transition text-white">
                        <LogOut size={18}/> Logout
                    </button>
                </div>
            </aside>

            {/*  Main Content */}
            <main className="flex-1 flex flex-col">

                {/* Top Navbar */}
                <header className="bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 shadow-md px-6 py-3 flex items-center justify-between text-white">
                    <h1 className="text-xl font-bold tracking-wide ">Dashboard</h1>
                    <div className=" absolute right-6 flex items-center gap-4">
                        <input 
                        type="text" 
                        placeholder="Search Recipes..."
                        className= "rounded-full px-4 py-2 w-64 text-sm text-gray-200 focus:ring-2 focus:ring-black focus:outline-none shadow-md"
                        />
                        {/* Dark mode toggle */}
                        <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
                        >
                            {darkMode ? <Sun size={18} className="text-yellow-400"/> : <Moon size={18} className="text-white"/>}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 overflow-y-auto ">
                    <div className="rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl shadow-lg p-6 min-h-[80vh]">
                    {/* Stats bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {statCards.map((stat, idx) => (
                            <div 
                            key={idx}
                            className={`p-6 rounded-2xl shadow-md text-white font-semibold bg-gradient-to-r ${stat.color} backdrop-blur-lg`}
                            >
                                <h3 className="text-sm uppercase tracking-wide opacity-90">{stat.title}</h3>
                                <p className="text-2xl mt-2">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                    {statsError && <p className="text-sm text-red-600">{statsError}</p>}
                <Outlet/>
                </div>
                </div>
            </main>
        </div>
    );
}

