import { createContext, useContext, useEffect, useState } from "react";
import {api} from '../utils/api';
import { endpoints } from "../config/endpoints";

const AuthContext = createContext(null);

export function AuthProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // on mount try to load current user with existing token
    useEffect(() =>{
        const token = localStorage.getItem("token");
        if(token){
            api.get(endpoints.auth.me)
            .then((res) => setUser(res.data.user))
            .catch(() =>{localStorage.removeItem("token"); setUser(null);})
            .finally(() => setLoading(false))
        }
        else{
            setLoading(false);
        }
    }, []);

    const login = async(email, password) =>{
        const {data} = await api.post(endpoints.auth.login, {email, password });
        localStorage.setItem("token", data.token);

        // fetch user info with token
        const res = await api.get(endpoints.auth.me);
        setUser(res.data.user);
        return res.data.user;
    };

    const register = async(name, email, password) =>{
        const {data} = await api.post(endpoints.auth.register, {name, email, password});
       // localStorage.setItem("token", data.token);
      //  setUser(data.user);
        return data.user;
    };

    const logout = () => {localStorage.removeItem("token"); setUser(null);};

    return (
        <AuthContext.Provider value={{user, loading, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    );
}
export function useAuth() {
    return useContext(AuthContext); 
}