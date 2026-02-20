import React, { useState, useEffect } from "react";
import { NavigationProps, BookingStatus } from "../types";
import { adminService } from "../services/api";

export const BookingsPage: React.FC<NavigationProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await adminService.getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleExport = () => {
    const headers = [
      "ID",
      "Service",
      "Amount",
      "Status",
      "Date",
      "Time",
      "Customer",
      "Address",
    ];
    const csvData = filteredBookings.map((b) =>
      [
        b.id || b._id,
        b.serviceName,
        b.amount,
        b.status,
        b.date,
        b.time,
        b.customerName || b.customerId,
        `"${b.address}"`,
      ].join(","),
    );

    const csvContent = [headers.join(","), ...csvData].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings_export_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleViewDetails = (booking: any) => {
    alert(
      `Booking Details:\nID: ${booking.id || booking._id}\nService: ${booking.serviceName}\nAmount: ₹${booking.amount}\nStatus: ${booking.status}\nCustomer ID: ${booking.customerId}\nAddress: ${booking.address}`,
    );
  };

  const handleAssignPartner = async (bookingId: string) => {
    try {
      const partners = await adminService.getPartners();
      if (partners.length === 0) {
        alert("No partners available to assign.");
        return;
      }

      const partnerNames = partners
        .map((p: any, i: number) => `${i + 1}. ${p.name} (${p.phone})`)
        .join("\n");
      const choice = prompt(
        `Select a partner (Enter number 1-${partners.length}):\n${partnerNames}`,
      );

      if (choice) {
        const index = parseInt(choice) - 1;
        if (index >= 0 && index < partners.length) {
          const selectedPartner = partners[index];
          await adminService.assignPartner(
            bookingId,
            selectedPartner.id || selectedPartner._id,
            selectedPartner.name,
          );
          alert(`Partner ${selectedPartner.name} assigned successfully!`);
          fetchBookings(); // Refresh list
        } else {
          alert("Invalid selection.");
        }
      }
    } catch (error) {
      console.error("Failed to assign partner:", error);
      alert("Error assigning partner.");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const id = b.id || b._id || "";
    const serviceName = b.serviceName || "";
    const matchesSearch =
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case BookingStatus.COMPLETED:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case BookingStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case BookingStatus.CONFIRMED:
      case BookingStatus.PARTNER_ASSIGNED:
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case BookingStatus.PENDING:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case BookingStatus.CANCELLED:
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

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
            Bookings
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage all service bookings
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dim transition-colors"
        >
          <span className="material-symbols-outlined text-lg">download</span>
          Export
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          "all",
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.IN_PROGRESS,
          BookingStatus.COMPLETED,
          BookingStatus.CANCELLED,
        ].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              statusFilter === status
                ? "bg-primary text-white"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {status === "all" ? "All Bookings" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search by ID, customer, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-dashed border-gray-300 dark:border-gray-700">
            <p className="text-gray-500">
              No bookings found matching your criteria.
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking.id || booking._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm text-gray-500">
                      #{booking.id || booking._id}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${getStatusBadge(booking.status || "")}`}
                    >
                      {(booking.status || "UNKNOWN").replace("_", " ")}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{booking.serviceName}</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">
                    ₹{booking.amount}
                  </p>
                  <p className="text-sm text-gray-500">
                    {booking.date} • {booking.time}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Customer
                  </p>
                  <p className="font-medium">
                    {booking.customerName ||
                      "Customer ID: " + booking.customerId}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Partner
                  </p>
                  <p className="font-medium">
                    {booking.partnerName || "Not assigned"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">
                    Address
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {booking.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500">
                  Created:{" "}
                  {booking.createdAt
                    ? new Date(booking.createdAt).toLocaleString()
                    : "N/A"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="px-3 py-1.5 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    View Details
                  </button>
                  {booking.status === BookingStatus.PENDING && (
                    <button
                      onClick={() =>
                        handleAssignPartner(booking.id || booking._id)
                      }
                      className="px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary-dim transition-colors"
                    >
                      Assign Partner
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
