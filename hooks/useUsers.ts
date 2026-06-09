import { api } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export interface User {
    id: number,
    first_name: string
    last_name: string
    email: string
    avatar: string
    role?: string
    status?: "active" | "inactive"
}

interface UsersResponse {
    page: number,
    per_page: number
    total: number
    total_pages: number
    data: User[]
}

export const useUsers = (page: number) => {
    return useQuery({
        queryKey: ["users", page],
        queryFn: async () => {
            const response = await api.get<UsersResponse>(`/users?page=${page}`)
            return response.data
        }
    })
}

export const useAddUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async (userData: Partial<User>) => {
            const response = await api.post("/users", userData)
            return response.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast.success("User added successfully")
        },
        onError: () => {
            toast.error("Failed to add user")
        }
    })
}


export const useUpdateUser = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: async ({ id, data }: { id: number; data: Partial<User> }) => {
            const response = await api.put(`/users/${id}`, data);
            return response.data

        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            toast.success("User updated Successfully")
        },
        onError: () => {
            toast.error("Failed to update user")
        }
    })
}
