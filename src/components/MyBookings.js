import { useEffect, useState, useCallback } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async (currentUser) => {
    if (!currentUser) return;

    try {
      const q = query(
        collection(db, "bookings"),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      Swal.fire("เกิดข้อผิดพลาด", "โหลดข้อมูลไม่สำเร็จ", "error");
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        await fetchBookings(currentUser);
      }
    });

    return () => unsubscribe();
  }, [fetchBookings]);

  const handlePayment = async (booking) => {
    const confirm = await Swal.fire({
      title: "ยืนยันการชำระเงิน?",
      text: `ยอดชำระ ${booking.price} บาท`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      confirmButtonText: "ชำระเงิน",
    });

    if (confirm.isConfirmed) {
      try {
        await updateDoc(doc(db, "bookings", booking.id), {
          status: "paid",
        });

        Swal.fire("ชำระเงินสำเร็จ 🎉", "", "success");

        if (user) {
          fetchBookings(user);
        }
      } catch (error) {
        console.error(error);
        Swal.fire("ผิดพลาด", "ไม่สามารถอัปเดตสถานะได้", "error");
      }
    }
  };

  const handleCancel = async (booking) => {
    if (booking.status === "paid") {
      Swal.fire("ไม่สามารถยกเลิกได้", "รายการนี้ชำระเงินแล้ว", "info");
      return;
    }

    const confirm = await Swal.fire({
      title: "ยืนยันการยกเลิก?",
      text: "คุณต้องการยกเลิกการจองนี้หรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ยกเลิกการจอง",
    });

    if (confirm.isConfirmed) {
      try {
        await deleteDoc(doc(db, "bookings", booking.id));
        Swal.fire("ยกเลิกสำเร็จ", "", "success");

        if (user) {
          fetchBookings(user);
        }
      } catch (error) {
        console.error(error);
        Swal.fire("ผิดพลาด", "ไม่สามารถลบรายการได้", "error");
      }
    }
  };

  const getStatusUI = (status) => {
    if (status === "paid") {
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
          ✅ ชำระเงินแล้ว
        </span>
      );
    }

    return (
      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
        ⏳ รอชำระเงิน
      </span>
    );
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!user) {
    return <div className="p-10 text-center">กรุณาเข้าสู่ระบบ</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-24">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📖 ประวัติการจองของฉัน
      </h1>

      {bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          ยังไม่มีรายการจอง
        </div>
      ) : (
        <div className="grid gap-4 max-w-4xl mx-auto">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-6 rounded-xl shadow-lg flex justify-between items-center border"
            >
              <div>
                <p className="font-bold text-lg">
                  🏸 คอร์ท {booking.court}
                </p>
                <p className="text-gray-600">📅 {booking.date}</p>
                <p className="text-gray-600">⏰ {booking.time}</p>
                <p className="text-gray-800 font-semibold mt-2">
                  💰 {booking.price} บาท
                </p>

                <div className="mt-2">
                  {getStatusUI(booking.status)}
                </div>
              </div>

              {booking.status === "pending" && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handlePayment(booking)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                  >
                    💳 ชำระเงิน
                  </button>

                  <button
                    onClick={() => handleCancel(booking)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    ยกเลิก
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;