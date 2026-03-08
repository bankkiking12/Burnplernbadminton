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
import jsQR from "jsqr";

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

  const checkQRInImage = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const code = jsQR(
        imageData.data,
        imageData.width,
        imageData.height
      );

      resolve(code !== null);
    };

    reader.readAsDataURL(file);
  });
};

const handlePayment = async (booking) => {

  const { value: file } = await Swal.fire({
    title: "ชำระเงินผ่าน PromptPay",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;text-align:center">

        <img 
          src="/promptpay.jpg" 
          style="width:260px;border-radius:12px;margin-bottom:15px"
        />

        <p style="font-size:18px;font-weight:bold;margin:10px 0">
          ยอดชำระ ${booking.price} บาท
        </p>

        <p style="color:gray;font-size:14px">
          สแกน QR แล้วอัปโหลดสลิป
        </p>

      </div>
    `,
    input: "file",
    inputAttributes: {
      accept: "image/*"
    },
    confirmButtonText: "อัปโหลดสลิป",
    cancelButtonText: "ยกเลิก",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
  });

  if (!file) return;

  Swal.showLoading();

  const hasQR = await checkQRInImage(file);

  if (!hasQR) {
    Swal.fire(
      "ไม่พบ QR Code",
      "กรุณาอัปโหลดสลิปที่มี QR Code",
      "error"
    );
    return;
  }

  try {

    await updateDoc(doc(db, "bookings", booking.id), {
      status: "paid",
    });

    Swal.fire(
      "ชำระเงินสำเร็จ 🎉",
      "ตรวจพบ QR Code ในสลิป",
      "success"
    );

    if (user) fetchBookings(user);

  } catch (error) {

    Swal.fire(
      "เกิดข้อผิดพลาด",
      "ไม่สามารถบันทึกการชำระเงินได้",
      "error"
    );

  }
};


  const handleCancel = async (booking) => {
    if (booking.status === "paid") {
      Swal.fire("ไม่สามารถยกเลิกได้", "รายการนี้ชำระเงินแล้ว", "info");
      return;
    }

    const confirm = await Swal.fire({
      title: "ยืนยันการยกเลิก?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "ยกเลิกการจอง",
    });

    if (confirm.isConfirmed) {
      await deleteDoc(doc(db, "bookings", booking.id));
      Swal.fire("ยกเลิกสำเร็จ", "", "success");
      if (user) fetchBookings(user);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        กรุณาเข้าสู่ระบบ
      </div>
    );
  }

  const paid = bookings.filter((b) => b.status === "paid").length;
  const pending = bookings.length - paid;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-24 text-white">

      <div className="max-w-5xl mx-auto space-y-8 animate-fadeIn">

        <h1 className="text-4xl font-bold text-center mb-8">
          📖 ประวัติการจองของฉัน
        </h1>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-6">

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl text-center shadow-lg">
            <p className="text-gray-400">ทั้งหมด</p>
            <p className="text-3xl font-bold mt-2">{bookings.length}</p>
          </div>

          <div className="bg-green-500/20 p-6 rounded-2xl text-center shadow-lg">
            <p className="text-green-300">ชำระแล้ว</p>
            <p className="text-3xl font-bold text-green-400 mt-2">{paid}</p>
          </div>

          <div className="bg-yellow-500/20 p-6 rounded-2xl text-center shadow-lg">
            <p className="text-yellow-300">รอชำระ</p>
            <p className="text-3xl font-bold text-yellow-400 mt-2">{pending}</p>
          </div>

        </div>

        {/* Booking List */}
        {bookings.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-2xl text-center">
            ยังไม่มีรายการจอง
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center hover:scale-[1.02] transition-all duration-300"
              >
                <div>
                  <p className="text-xl font-bold">
                    🏸 คอร์ท {booking.court}
                  </p>
                  <p className="text-gray-300 mt-1">📅 {booking.date}</p>
                  <p className="text-gray-300">⏰ {booking.time}</p>
                  <p className="text-lg font-semibold mt-2 text-green-400">
                    💰 {booking.price} บาท
                  </p>

                  <div className="mt-3">
                    {booking.status === "paid" ? (
                      <span className="px-4 py-1 rounded-full text-sm bg-green-500/30 text-green-400 border border-green-400">
                        ✅ ชำระเงินแล้ว
                      </span>
                    ) : (
                      <span className="px-4 py-1 rounded-full text-sm bg-yellow-500/30 text-yellow-400 border border-yellow-400">
                        ⏳ รอชำระเงิน
                      </span>
                    )}
                  </div>
                </div>

                {booking.status === "pending" && (
                  <div className="flex gap-3 mt-4 md:mt-0">
                    <button
                      onClick={() => handlePayment(booking)}
                      className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl font-semibold shadow-lg shadow-green-500/30 transition hover:scale-105"
                    >
                      💳 ชำระเงิน
                    </button>

                    <button
                      onClick={() => handleCancel(booking)}
                      className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-semibold shadow-lg shadow-red-500/30 transition hover:scale-105"
                    >
                      🗑 ยกเลิก
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyBookings;