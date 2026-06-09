import axios from "axios";

export const api = axios.create({
    baseURL: "https://reqres.in/api",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || ''
    }
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 2026 00:00:01 GMT"
        }
        return Promise.reject(error)
    }
)