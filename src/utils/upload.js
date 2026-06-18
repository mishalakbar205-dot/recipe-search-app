import { api } from "./api";
import { endpoints } from "../config/endpoints";

export async function uploadImage(file, fieldName = 'image'){
    const form = new FormData();
    form.append(fieldName, file);

    const res = await api.post(endpoints.uploads.image(), form, {
        headers: {'Content-Type': 'multipart/form-data'}
    });

    return res.data;  
}