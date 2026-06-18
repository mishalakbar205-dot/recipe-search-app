const baseURL = import.meta.env.VITE_API_BASE_URL

export const getImageUrl = (path) => {
    if(!path) return "placeholder.png";

    if (path.startsWith("http")) return path;
   
     return `${baseURL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}; 
 