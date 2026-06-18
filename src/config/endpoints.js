

const rawBase = import.meta.env.VITE_API_BASE_URL;
export const endpoints = {
    auth: {
        login :  `${rawBase}/api/auth/login`,
        register : `${rawBase}/api/auth/register`,
        me:       `${rawBase}/api/auth/me`,
        logout:    `${rawBase}/api/auth/logout` ,
    },
    recipes: {
        base: `${rawBase}/api/recipes`,
    },
    categories: {
        base:   `${rawBase}/api/categories`,
    },
    uploads: {
        image:   `${rawBase}/api/uploads/image`,    
    }

}