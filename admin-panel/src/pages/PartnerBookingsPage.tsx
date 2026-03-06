import React, { useState, useEffect } from "react";
import {
  NavigationProps,
  Booking,
  BookingStatus,
  Professional,
} from "../types";
import { partnerService } from "../services/api";

export const PartnerBookingsPage: React.FC<NavigationProps> = ({ admin }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProfessionalByBooking, setSelectedProfessionalByBooking] =
    useState<Record<string, string>>({});

  const fetchBookings = async () => {
    if (!admin?.partnerId) return;
    try {
      setLoading(true);
      const data = await partnerService.getBookings(admin.partnerId);
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch partner bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfessionals = async () => {
    if (!admin?.partnerId) return;
    try {
      const data = await partnerService.getProfessionals(admin.partnerId);
      setProfessionals(data);
    } catch (error) {
      console.error("Failed to fetch partner professionals:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchProfessionals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin?.partnerId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case BookingStatus.COMPLETED:
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case BookingStatus.IN_PROGRESS:
      case BookingStatus.CONFIRMED:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case BookingStatus.PENDING:
      case BookingStatus.NEW_FOR_PARTNERS:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case BookingStatus.CANCELLED:
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

  const handleAccept = async (bookingId: string) => {
    if (!admin?.partnerId) return;
    try {
      await partnerService.acceptBooking(admin.partnerId, bookingId);
      await fetchBookings();
    } catch (error) {
      console.error("Failed to accept booking:", error);
    }
  };

  const handleReject = async (bookingId: string) => {
    if (!admin?.partnerId) return;
    try {
      await partnerService.rejectBooking(admin.partnerId, bookingId);
      await fetchBookings();
    } catch (error) {
      console.error("Failed to reject booking:", error);
    }
  };

  const handleAssign = async (bookingId: string) => {
    if (!admin?.partnerId) return;
    const selected =
      selectedProfessionalByBooking[bookingId] || professionals[0]?.id;
    if (!selected) return;
    try {
      await partnerService.assignProfessional(
        admin.partnerId,
        bookingId,
        selected,
      );
      await fetchBookings();
    } catch (error) {
      console.error("Failed to assign professional:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            My Bookings & Leads
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage new booking leads and assigned jobs within your service areas
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
                    {booking.status === BookingStatus.NEW_FOR_PARTNERS && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(booking.id)}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(booking.id)}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {booking.status === BookingStatus.PARTNER_ACCEPTED && (
                      <div className="flex flex-col gap-2">
                        <select
                          className="w-full h-9 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-xs font-medium px-2"
                          value={selectedProfessionalByBooking[booking.id] || ""}
                          onChange={(e) =>
                            setSelectedProfessionalByBooking((prev) => ({
                              ...prev,
                              [booking.id]: e.target.value,
                            }))
                          }
                        >
                          <option value="">Select professional</option>
                          {professionals.map((pro) => (
                            <option key={pro.id} value={pro.id}>
                              {pro.name} ({pro.phone})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssign(booking.id)}
                          className="px-3 py-1 text-xs font-bold rounded-lg bg-primary text-white hover:bg-primary-dim transition-colors disabled:opacity-50"
                          disabled={
                            professionals.length === 0 &&
                            !selectedProfessionalByBooking[booking.id]
                          }
                        >
                          Assign Professional
                        </button>
                      </div>
                    )}
                    {booking.status !== BookingStatus.NEW_FOR_PARTNERS &&
                      booking.status !== BookingStatus.PARTNER_ACCEPTED && (
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-primary transition-colors">
                          <span className="material-symbols-outlined text-lg">
                            visibility
                          </span>
                        </button>
                      )}
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
