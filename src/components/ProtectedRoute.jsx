import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({requireAdmin = false}){
    const {user, loading} = useAuth();

    if (loading) return null;
    if(!user) return <Navigate to = '/login' replace />;
    if(requireAdmin && !user.isAdmin) return <Navigate to = '/' replace />;
    return <Outlet />;
}