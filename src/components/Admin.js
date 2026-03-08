import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
  getDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

function Admin() {

  const [, setUser] = useState(null); // แก้ตรงนี้
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    revenue: 0
  });

  const checkAdmin = async (currentUser) => {

    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);

    if (!snap.exists() || snap.data().role !== "admin") {

      await Swal.fire(
        "ไม่มีสิทธิ์เข้าใช้งาน",
        "หน้านี้สำหรับ Admin เท่านั้น",
        "error"
      );

      window.location.href = "/";
      return false;
    }

    return true;
  };

  const fetchBookings = async () => {

    setLoading(true);

    try {

      let q = collection(db, "bookings");

      if (dateFilter) {
        q = query(q, where("date", "==", dateFilter));
      }

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setBookings(data);

      const total = data.length;
      const paid = data.filter((b) => b.status === "paid").length;
      const revenue = data.reduce(
        (sum, b) => sum + (b.status === "paid" ? Number(b.price) || 0 : 0),
        0
      );

      setStats({
        total,
        paid,
        revenue
      });

    } catch (error) {

      console.error(error);

    }

    setLoading(false);

  };

  useEffect(() => {

    const unsub = onAuthStateChanged(auth, async (currentUser) => {

      if (!currentUser) {
        window.location.href = "/login";
        return;
      }

      setUser(currentUser);

      const isAdmin = await checkAdmin(currentUser);

      if (isAdmin) {
        fetchBookings();
      }

    });

    return () => unsub();

  }, [dateFilter, fetchBookings]); // แก้ตรงนี้

  const handleDelete = async (id) => {

    const confirm = await Swal.fire({
      title: "ลบการจอง?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก"
    });

    if (!confirm.isConfirmed) return;

    await deleteDoc(doc(db, "bookings", id));

    Swal.fire("ลบแล้ว", "", "success");

    fetchBookings();
  };

  const togglePaid = async (booking) => {

    const newStatus =
      booking.status === "paid" ? "pending" : "paid";

    await updateDoc(doc(db, "bookings", booking.id), {
      status: newStatus
    });

    fetchBookings();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        กำลังโหลด...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          🛠 Admin Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-blue-100 p-6 rounded-xl text-center">
            <p className="text-3xl font-bold">{stats.total}</p>
            <p>Total Bookings</p>
          </div>

          <div className="bg-green-100 p-6 rounded-xl text-center">
            <p className="text-3xl font-bold">{stats.paid}</p>
            <p>Paid</p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-xl text-center">
            <p className="text-3xl font-bold">
              {stats.revenue} บาท
            </p>
            <p>Revenue</p>
          </div>

        </div>

        <div className="mb-6">

          <input
            type="date"
            className="border p-2 rounded"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />

        </div>

        <div className="overflow-x-auto">

          <table className="w-full border">

            <thead className="bg-gray-200">

              <tr>

                <th className="p-3">วันที่</th>
                <th className="p-3">เวลา</th>
                <th className="p-3">คอร์ท</th>
                <th className="p-3">ราคา</th>
                <th className="p-3">สถานะ</th>
                <th className="p-3">จัดการ</th>

              </tr>

            </thead>

            <tbody>

              {bookings.map((b) => (

                <tr key={b.id} className="border-t text-center">

                  <td className="p-3">{b.date}</td>
                  <td className="p-3">{b.time}</td>
                  <td className="p-3">{b.court}</td>
                  <td className="p-3">{b.price || "-"}</td>

                  <td className="p-3">

                    <button
                      onClick={() => togglePaid(b)}
                      className={`px-3 py-1 rounded text-white ${
                        b.status === "paid"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {b.status || "pending"}
                    </button>

                  </td>

                  <td className="p-3">

                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      ลบ
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );
}

export default Admin;