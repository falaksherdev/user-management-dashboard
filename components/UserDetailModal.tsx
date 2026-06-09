"use client";

import { User } from "@/hooks/useUsers";
import {
  X,
  Mail,
  User as UserIcon,
  IdCard,
  Briefcase,
  Circle,
} from "lucide-react";
import Image from "next/image";

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function UserDetailModal({
  isOpen,
  onClose,
  user,
}: UserDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-slideUp">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex justify-center mb-6">
          <Image
            src={`https://reqres.in/img/faces/${user.id}-image.jpg`}
            alt={`${user.first_name} ${user.last_name}`}
            width={80}
            height={80}
            unoptimized={true}
            className="rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}&background=random`;
            }}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <UserIcon className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="font-medium text-gray-800">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <IdCard className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-xs text-gray-500">User ID</p>
              <p className="font-medium text-gray-800">#{user.id}</p>
            </div>
          </div>

          {user.role && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Role</p>
                <p className="font-medium text-gray-800 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          )}

          {user.status && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Circle className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium text-gray-800 capitalize">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      user.status === "active" ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {user.status}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
