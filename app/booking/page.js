"use client";

import { useEffect, useState } from "react";

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/booking");
        if (!res.ok) throw new Error("Failed to fetch bookings");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Customer</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Cruise Date</th>
              <th className="border px-4 py-2">Guests</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td className="border px-4 py-2">{booking.customerId?.name}</td>
                <td className="border px-4 py-2">{booking.customerId?.email}</td>
                <td className="border px-4 py-2">{booking.customerId?.phone}</td>
                <td className="border px-4 py-2">
                  {new Date(booking.cruiseDate).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{booking.numberOfGuests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
