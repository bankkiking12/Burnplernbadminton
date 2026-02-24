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

  // ✅ ใช้ useCallback ป้องกัน re-render function ใหม่ทุกครั้ง
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
        // reset ค่าถ้า logout
        setTotalBookings(0);
        setTotalPaid(0);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchStats]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await Swal.fire("ออกจากระบบแล้ว", "", "success");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <div className="p-10 text-center">กรุณาเข้าสู่ระบบ</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          👤 User Profile
        </h2>

        <div className="bg-gray-50 p-6 rounded-xl mb-6 border">
          <p className="text-lg font-semibold mb-2">
            📧 Email: {user.email}
          </p>
          <p className="text-gray-600 text-sm break-all">
            🔑 UID: {user.uid}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-100 p-6 rounded-xl text-center">
            <p className="text-2xl font-bold">{totalBookings}</p>
            <p className="text-sm">Total Bookings</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-xl text-center">
            <p className="text-2xl font-bold">{totalPaid} บาท</p>
            <p className="text-sm">Total Paid</p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;