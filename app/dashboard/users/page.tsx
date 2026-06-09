"use client";

import { useState } from "react";

import { useUsers } from "@/hooks/useUsers";

import { UserTable } from "@/components/UserTable";
import { Plus, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AddUserModal } from "@/components/AddUserModal";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { data, isLoading, error } = useUsers(page);
  const router = useRouter();

  const logout = useAuthStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const filterUsers = data?.data.filter(
    (user) =>
      user?.first_name?.toLowerCase().includes(search?.toLowerCase()) ||
      user?.last_name?.toLowerCase().includes(search?.toLowerCase()) ||
      user?.email?.toLowerCase().includes(search?.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              User Management
            </h1>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Add User
              </button>
              <button
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <input
            type="text"
            placeholder="search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-700"
          />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rouded-lg p-4 text-center">
            <p className="text-red-600">Failed to load users,Try again</p>
          </div>
        )}
        <UserTable
          users={filterUsers || []}
          isLoading={isLoading}
          currentPage={page}
          totalPages={data?.total_pages || 1}
          onPageChange={setPage}
        />
      </div>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}
