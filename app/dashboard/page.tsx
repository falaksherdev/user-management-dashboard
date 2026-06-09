"use client";
import { useUsers } from "@/hooks/useUsers";

import { Users, UserCheck, UserX, UserPlus } from "lucide-react";

import Link from "next/link";

export default function DashboardPage() {
  const { data, isLoading } = useUsers(1);

  const totalUsers = data?.total || 0;
  const activeUsers = Math.floor(totalUsers * 0.7);
  const inactiveUsers = totalUsers - activeUsers;
  const newUsers = Math.floor(totalUsers * 0.2);
  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Inactive Users",
      value: inactiveUsers,
      icon: UserX,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      title: "New Users",
      value: newUsers,
      icon: UserPlus,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <Link
            href="/dashboard/users"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Manage Users
          </Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cos-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">{card.title}</p>
                    {isLoading ? (
                      <div className="h-8 bg-gray-200 rounded animate-pulse mt-2"></div>
                    ) : (
                      <p className="text-3xl font-bold text-gray-800 mt-2">
                        {card.value}
                      </p>
                    )}
                  </div>
                  <div className={`${card.bgColor} p-3 rounded-full`}>
                    <Icon className={`w-6 h-6 font-bold ${card.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
