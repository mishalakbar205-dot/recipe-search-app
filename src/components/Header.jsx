import { Link,  useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";

function Header(){
    const searchRef = useRef()
    const navigate = useNavigate()

    const {user, logout} = useAuth();

    const handleSearch = (e) =>{
        e.preventDefault(); // stops the page from reloading
        const query = searchRef.current.value
        navigate(`/search?query=${query}`)

    };

    return(
        <>
           <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500"></div>
         
        
        <header className="sticky top-0 z-50 border-b border-gray-700 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-md shadow-lg" >
           
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
            <Link to= "/" 
            className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 bg-clip-text text-transparent">Recipe App</Link> 

            <nav className=" flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
               {/* <h1 className="">Recipe Search</h1>*/}
                

                <Link to = "/" className="text-gray-300 hover:text-blue-400 hover:underline underline-offset-4" >Home</Link>
                <Link to = "/categories" className="text-gray-300 hover:text-purple-400 hover:underline underline-offset-4">Categories</Link>
                <Link to = "/recipes" className="text-gray-300 hover:text-rose-400 hover:underline underline-offset-4">All Recipes</Link>

                {/* Auth-dependent links  */}
                {user ? (
                    <>
                    {/* Dashboard link only visible to admin */}
                    {user.isAdmin && (
                        <Link to = "/dashboard" className="text-gray-300 hover:text-green-400 hover:underline underline-offset-4">
                            Dashboard
                        </Link>
                    )}
                    <span className="text-xs font-medium text-gray-400 ">Hi, {user.name}</span>
                    <button
                    onClick={logout}
                    className="rounded-full px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500 shadow hover:opacity-90 transition"
                    >
                        Logout
                    </button>
                    </>
                ) : (
                    <>
                    <Link to = "/login" className="text-gray-300 hover:text-blue-600 hover:underline underline-offset-4">
                    Login
                    </Link>
                    <Link to = "/register" className="text-gray-300 hover:text-purple-600 hover:underline underline-offset-4">
                    Register
                    </Link>
                    </>
                )}
                </div>
            </nav>            
            {/* Search box */}
            <form onSubmit={handleSearch} className="w-full md:w-auto" >
                <div className="flex items-center overflow-hidden rounded-full border border-gray-200 bg-white/80 shadow-sm focus-within:ring-2 focus-within:ring-blue-400">

                <input ref={searchRef}
                 className="h-10 w-full min-w-0 flex-1 px-4 text-sm text-black placeholder:text-gray-400 outline-none bg-transparent"
                  placeholder ="Search for recipes"
                   />
                <button
                 type="submit"
                  className="h-10 shrink-0 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition">
                    Search
                    </button>
                    </div>
            </form>
            </div>
            </div>
           
        </header>
        </>
    );
}
export default Header;