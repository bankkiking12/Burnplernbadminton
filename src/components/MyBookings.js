import { useEffect, useState } from "react";
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
import Swal from "sweetalert2";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setBookings(data);
  };

  
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
      await updateDoc(doc(db, "bookings", booking.id), {
        status: "paid",
      });

      Swal.fire("ชำระเงินสำเร็จ 🎉", "", "success");
      fetchBookings();
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
      await deleteDoc(doc(db, "bookings", booking.id));
      Swal.fire("ยกเลิกสำเร็จ", "", "success");
      fetchBookings();
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

                <p className="text-gray-600">
                  📅 {booking.date}
                </p>

                <p className="text-gray-600">
                  ⏰ {booking.time}
                </p>

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