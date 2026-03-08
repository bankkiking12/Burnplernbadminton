import { useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

function Profile() {
  const [user, setUser] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async (currentUser) => {
    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", currentUser.uid)
      );

      const snapshot = await getDocs(q);

      let count = 0;
      let paidAmount = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        count++;

        if (data.status === "paid") {
          paidAmount += Number(data.price) || 0;
        }
      });

      setTotalBookings(count);
      setTotalPaid(paidAmount);

    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await fetchStats(currentUser);
      } else {
        setTotalBookings(0);
        setTotalPaid(0);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchStats]);

  const handleLogout = async () => {
    try {

      const confirm = await Swal.fire({
        title: "ออกจากระบบ?",
        text: "คุณต้องการออกจากระบบใช่หรือไม่",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "ออกจากระบบ",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#ef4444"
      });

      if (!confirm.isConfirmed) return;

      await signOut(auth);

      await Swal.fire("ออกจากระบบแล้ว", "", "success");

      window.location.href = "/login";

    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl">
        กำลังโหลดข้อมูล...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-xl">
        กรุณาเข้าสู่ระบบ
      </div>
    );

  const average =
    totalBookings === 0 ? 0 : Math.round(totalPaid / totalBookings);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex justify-center items-center p-6 text-white">

      <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-4xl">

        <h2 className="text-3xl font-bold mb-8 text-center">
          👤 User Profile
        </h2>

        {/* USER CARD */}

        <div className="bg-white/10 border border-white/20 p-6 rounded-2xl mb-8 flex items-center gap-6">

          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold">
            {user.email.charAt(0).toUpperCase()}
          </div>

          <div>

            <p className="text-lg font-semibold">
              📧 {user.email}
            </p>

            <p className="text-gray-400 text-sm break-all">
              🔑 UID: {user.uid}
            </p>

          </div>

        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          <div className="bg-green-500/20 p-6 rounded-2xl text-center hover:scale-105 transition">

            <p className="text-3xl font-bold">
              {totalBookings}
            </p>

            <p className="text-sm text-green-300">
              Total Bookings
            </p>

          </div>

          <div className="bg-blue-500/20 p-6 rounded-2xl text-center hover:scale-105 transition">

            <p className="text-3xl font-bold">
              {totalPaid} บาท
            </p>

            <p className="text-sm text-blue-300">
              Total Paid
            </p>

          </div>

          <div className="bg-purple-500/20 p-6 rounded-2xl text-center hover:scale-105 transition">

            <p className="text-3xl font-bold">
              {average} บาท
            </p>

            <p className="text-sm text-purple-300">
              Avg Booking
            </p>

          </div>

        </div>

        {/* PAYMENT BAR */}

        <div className="mb-8">

          <p className="text-gray-300 mb-2">
            การใช้จ่ายทั้งหมด
          </p>

          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">

            <div
              className="bg-green-500 h-4 transition-all duration-700"
              style={{
                width: `${Math.min(totalPaid / 50, 100)}%`
              }}
            />

          </div>

        </div>

        {/* LOGOUT */}

        <div className="flex justify-center">

          <button
            onClick={handleLogout}
            className="bg-red-500 px-8 py-3 rounded-xl font-semibold hover:bg-red-600 transition hover:scale-105 shadow-lg"
          >
            🚪 Logout
          </button>

        </div>

      </div>

    </div>
  );
}

export default Profile;