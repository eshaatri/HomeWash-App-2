import React, { useState, useEffect } from "react";
import { NavigationProps, Booking } from "../types";
import { partnerService } from "../services/api";

export const PartnerBookingsPage: React.FC<NavigationProps> = ({ admin }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBookings = async () => {
    if (admin?.partnerId) {
      try {
        setLoading(true);
        const data = await partnerService.getBookings(admin.partnerId);
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch partner bookings:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [admin?.partnerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "CANCELLED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Assigned Bookings
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage leads and schedules within your partner service area
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            type="text"
            placeholder="Search by ID, customer name or service..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 focus:outline-none focus:border-primary font-bold text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 dark:border-gray-700">
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Booking ID
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Customer
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Service
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Amount
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Status
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Date/Time
              </th>
              <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs"
                >
                  Loading bookings...
                </td>
              </tr>
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <td className="p-4 font-mono text-xs text-gray-500">
                    #{booking.id}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-sm tracking-tight">
                      {booking.customerName}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Bandra West
                    </p>
                  </td>
                  <td className="p-4 font-medium text-sm">
                    {booking.serviceName}
                  </td>
                  <td className="p-4 font-black text-sm">₹{booking.amount}</td>
                  <td className="p-4">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${getStatusColor(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="text-xs font-bold">{booking.scheduledDate}</p>
                    <p className="text-[10px] text-gray-400">
                      {booking.scheduledTime}
                    </p>
                  </td>
                  <td className="p-4">
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-lg">
                        visibility
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="p-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs"
                >
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
