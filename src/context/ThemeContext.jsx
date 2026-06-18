import { createContext, useContext,useState, useEffect, useMemo } from "react";

export const ThemeContext = createContext([false, () => {}]);

export function ThemeProvider({children}){
    const[darkMode, setDarkMode] = useState(() =>{
        const stored = localStorage.getItem("darkMode");
        return stored ? stored === "true" : false;
    });
        
     // keep <html> in sync for tailwind "dark" classes
    useEffect(() =>{
        localStorage.setItem("darkMode", String(darkMode));
        const root = document.documentElement;
        if(darkMode) {
            root.classList.add('dark');
        }
        else{
            root.classList.remove("dark");
        }
    }, [darkMode]);

    const value = useMemo(() => [darkMode, setDarkMode], [darkMode]);
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

