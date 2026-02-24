import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [paidBookings, setPaidBookings] = useState(0);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setUser(currentUser);
    fetchStats(currentUser.uid);
  }, []);

  const fetchStats = async (uid) => {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", uid)
    );

    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map((doc) => doc.data());

    setTotalBookings(bookings.length);
    setPaidBookings(bookings.filter((b) => b.status === "paid").length);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        กรุณาเข้าสู่ระบบ
      </div>
    );
  }

  const pending = totalBookings - paidBookings;
  const percentPaid =
    totalBookings === 0 ? 0 : Math.round((paidBookings / totalBookings) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-24 text-white">

      <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">

        {/* User Info */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold mb-4">👤 ข้อมูลผู้ใช้</h1>
          <p className="text-gray-300">Email: {user.email}</p>
          <p className="text-gray-400 text-sm break-all">User ID: {user.uid}</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-gray-400">รายการจองทั้งหมด</p>
            <p className="text-4xl font-bold mt-3">{totalBookings}</p>
          </div>

          <div className="bg-green-500/20 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-green-300">ชำระเงินแล้ว</p>
            <p className="text-4xl font-bold text-green-400 mt-3">
              {paidBookings}
            </p>
          </div>

          <div className="bg-yellow-500/20 backdrop-blur-md p-6 rounded-2xl shadow-lg hover:scale-105 transition">
            <p className="text-yellow-300">รอชำระเงิน</p>
            <p className="text-4xl font-bold text-yellow-400 mt-3">
              {pending}
            </p>
          </div>

        </div>

        {/* Payment Progress */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl">
          <p className="mb-3 text-gray-300">ความคืบหน้าการชำระเงิน</p>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-500 h-4 transition-all duration-700"
              style={{ width: `${percentPaid}%` }}
            />
          </div>
          <p className="text-sm text-green-400 mt-2">
            {percentPaid}% ชำระแล้ว
          </p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-xl flex flex-wrap gap-4">

          <Link
            to="/booking"
            className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/30 transition hover:scale-105"
          >
            ➕ จองคอร์ทใหม่
          </Link>

          <Link
            to="/my-bookings"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition hover:scale-105"
          >
            📖 ดูประวัติการจอง
          </Link>

          <Link
            to="/board"
            className="bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-xl font-semibold shadow-lg shadow-purple-500/30 transition hover:scale-105"
          >
            📅 ดูตารางคอร์ทว่าง
          </Link>

        </div>

      </div>
    </div>
  );
}

export default UserDashboard;