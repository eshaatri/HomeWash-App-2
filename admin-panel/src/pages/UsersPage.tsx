import React, { useState, useEffect } from "react";
import { NavigationProps } from "../types";
import { adminService } from "../services/api";

interface User {
  _id: string;
  name: string;
  phone: string;
  role: 'ADMIN' | 'PARTNER' | 'CUSTOMER' | 'VENDOR';
  walletBalance: number;
  totalBookings?: number;
  totalSpent?: number;
  lastActive?: string;
  isActive?: boolean;
  createdAt: string;
}

export const UsersPage: React.FC<NavigationProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setCustomers(data.filter((u: any) => u.role === "CUSTOMER"));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: User) => {
    // TODO: Implement Edit Modal
    alert(`Edit ${customer.name}`);
    setActiveActionId(null);
  };

  const handleViewBookings = (customer: User) => {
    // TODO: Navigate to bookings
    alert(`View bookings for ${customer.name}`);
    setActiveActionId(null);
  };

  const handleBlock = async (customer: User) => {
    // TODO: Implement Block API
    if (confirm(`Are you sure you want to ${customer.isActive === false ? 'unblock' : 'block'} ${customer.name}?`)) {
      try {
        await adminService.updateUser(customer._id, { isActive: !customer.isActive });
        fetchUsers();
      } catch (e) {
        console.error(e);
        alert("Failed to update status");
      }
    }
    setActiveActionId(null);
  };

  const handleDelete = async (customer: User) => {
    if (confirm(`Are you sure you want to delete ${customer.name}? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(customer._id);
        fetchUsers();
      } catch (e) {
        console.error(e);
        alert("Failed to delete user");
      }
    }
    setActiveActionId(null);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm),
  );

  return (
    <div className="p-6" onClick={() => setActiveActionId(null)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customers
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your customer base
          </p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors">
          <span className="material-symbols-outlined text-lg">add</span>
          Add Customer
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              search
            </span>
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <span className="material-symbols-outlined text-lg">
              filter_list
            </span>
            Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ minHeight: '400px' }}>
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Customer
              </th>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Contact
              </th>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Bookings
              </th>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Total Spent
              </th>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Last Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCustomers.map((customer) => (
              <tr
                key={customer._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-gray-500">
                        Since{" "}
                        {customer.createdAt
                          ? new Date(customer.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm">{customer.phone}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">
                    {customer.totalBookings || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-green-600">
                    ₹{(customer.totalSpent || 0).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${customer.isActive !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {customer.isActive !== false ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {customer.lastActive || "N/A"}
                </td>
                <td className="px-6 py-4 text-right relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveActionId(activeActionId === customer._id ? null : customer._id);
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                  {activeActionId === customer._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 overflow-hidden">
                      <button onClick={() => handleEdit(customer)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">edit</span> Edit Details
                      </button>
                      <button onClick={() => handleViewBookings(customer)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">visibility</span> View Bookings
                      </button>
                      <button onClick={() => handleBlock(customer)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-orange-600">
                        <span className="material-symbols-outlined text-sm">block</span> {customer.isActive !== false ? 'Block' : 'Unblock'}
                      </button>
                      <button onClick={() => handleDelete(customer)} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600">
                        <span className="material-symbols-outlined text-sm">delete</span> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
