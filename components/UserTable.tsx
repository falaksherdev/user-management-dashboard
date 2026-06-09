"use client";

import { useState } from "react";
import { User } from "@/hooks/useUsers";

import { Edit, Eye } from "lucide-react";
import { EditUserModal } from "./EditUserModal";
import { UserDetailModal } from "./UserDetailModal";
import Image from "next/image";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UserTable({
  users,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: UserTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-ms overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avatar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ACtions
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="border-t">
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <p className="text-gray-500 text-lg">No users found</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-ms overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Avatar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ACtions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={i}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <td className="px-6 py-4">
                    <Image
                      src={`https://reqres.in/img/faces/${user.id}-image.jpg`}
                      alt={`${user.first_name} ${user.last_name}`}
                      width={40}
                      height={40}
                      unoptimized={true}
                      className="w-10 h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`;
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-gray-600">{user.id}</td>
                  <td className="px-6 py-4">
                    <div
                      className="flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDetailModalOpen(true);
                        }}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <button
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg disbaled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition text-gray-600"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg disbaled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition text-gray-600"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {selectedUser && (
        <>
          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            user={selectedUser}
          />
          <UserDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            user={selectedUser}
          />
        </>
      )}
    </>
  );
}
