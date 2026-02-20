import React, { useState, useEffect } from "react";
import { NavigationProps } from "../types";
import { adminService } from "../services/api";

export const UsersPage: React.FC<NavigationProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setCustomers(data.filter((u: any) => u.role === "CUSTOMER"));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleExport = () => {
    const headers = ["ID", "Name", "Phone", "Bookings", "Spent", "Joined Date"];
    const csvData = filteredCustomers.map((c) =>
      [
        c.id || c._id,
        c.name,
        c.phone,
        c.totalBookings || 0,
        c.totalSpent || 0,
        c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "N/A",
      ].join(","),
    );

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleAddCustomer = async () => {
    const name = prompt("Enter customer name:");
    const phone = prompt("Enter customer phone:");
    if (name && phone) {
      try {
        await adminService.createUser({ name, phone, role: "CUSTOMER" });
        alert("Customer added successfully!");
        fetchUsers();
      } catch (error) {
        alert("Failed to add customer.");
      }
    }
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete customer ${name}?`)) {
      try {
        await adminService.deleteUser(id);
        alert("Customer deleted successfully!");
        fetchUsers();
      } catch (error) {
        alert("Failed to delete customer.");
      }
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const name = c.name || "";
    const phone = c.phone || "";
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
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
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">download</span>
            Export
          </button>
          <button
            onClick={handleAddCustomer}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Customer
          </button>
        </div>
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Bookings
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Last Active
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No customers found matching your search.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((customer) => (
                <tr
                  key={customer.id || customer._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {(customer.name || "?").charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">
                          {customer.name || "Unknown"}
                        </p>
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
                    <p className="text-sm">{customer.phone || "N/A"}</p>
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
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {customer.lastActive || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          alert(
                            `Customer: ${customer.name}\nPhone: ${customer.phone}\nRole: CUSTOMER`,
                          )
                        }
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          visibility
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCustomer(
                            customer.id || customer._id,
                            customer.name,
                          )
                        }
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
