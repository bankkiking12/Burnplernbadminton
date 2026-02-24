import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import Swal from "sweetalert2";

function Booking() {
  const [date, setDate] = useState("");
  const [court, setCourt] = useState("1");
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState("");

  const pricePerHour = 150;

  const times = [
    "08:00 - 09:00","09:00 - 10:00","10:00 - 11:00","11:00 - 12:00",
    "12:00 - 13:00","13:00 - 14:00","14:00 - 15:00","15:00 - 16:00",
    "16:00 - 17:00","17:00 - 18:00","18:00 - 19:00","19:00 - 20:00",
    "20:00 - 21:00","21:00 - 22:00",
  ];

  useEffect(() => {
    if (!date) return;
    fetchSlots();
  }, [date, court]);

  const fetchSlots = async () => {
    const q = query(
      collection(db, "bookings"),
      where("date", "==", date),
      where("court", "==", court)
    );

    const res = await getDocs(q);
    const booked = res.docs.map((d) => d.data().time);
    setSlots(booked);
  };

  const handleBooking = async () => {
    if (!date || !selected) {
      Swal.fire("กรุณาเลือกวันที่และเวลา");
      return;
    }

    if (!auth.currentUser) {
      Swal.fire("กรุณาเข้าสู่ระบบก่อนจอง");
      return;
    }

    if (slots.includes(selected)) {
      Swal.fire("เวลานี้ถูกจองแล้ว");
      return;
    }

    await addDoc(collection(db, "bookings"), {
      userId: auth.currentUser.uid,
      userEmail: auth.currentUser.email,
      date,
      court,
      time: selected,
      price: pricePerHour,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    Swal.fire({
      icon: "success",
      title: "จองสำเร็จ 🎉",
      text: "สถานะ: รอชำระเงิน",
      confirmButtonColor: "#16a34a",
    });

    setSelected("");
    fetchSlots();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-24 text-white ">

      
      <div className="max-w-6xl mx-auto backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 animate-fadeIn">

        <h2 className="text-4xl font-bold text-center mb-10 tracking-wide">
          🏸 จองคอร์ทแบดมินตัน
        </h2>

        {/* Date + Court */}
       <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">

  <input
    type="date"
    className="bg-white/20 border border-white/30 text-white p-3 rounded-xl 
               focus:outline-none focus:ring-2 focus:ring-green-400 transition"
    value={date}
    onChange={(e) => setDate(e.target.value)}
  />

  <div className="relative">
    <select
      className="appearance-none bg-white/20 text-white
                 border border-gray-300 p-3 pr-10 rounded-xl
                 focus:outline-none focus:ring-2 focus:ring-green-400 
                 transition shadow-md"
      value={court}
      onChange={(e) => setCourt(e.target.value)}
    >
      <option className="text-black" value="1">คอร์ท 1</option>
      <option className="text-black" value="2">คอร์ท 2</option>
      <option className="text-black" value="3">คอร์ท 3</option>
    </select>

    {/* custom arrow */}
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-300">
      ▼
    </div>
  </div>

</div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {times.map((t) => {
            const isBooked = slots.includes(t);
            const isSelected = selected === t;

            return (
              <div key={t} className="relative group">

                <button
                  onClick={() => !isBooked && setSelected(t)}
                  disabled={isBooked}
                  className={`
                    w-full py-4 rounded-xl font-semibold transition-all duration-300
                    ${
                      isBooked
                        ? "bg-red-600/80 cursor-not-allowed"
                        : isSelected
                        ? "bg-green-500 scale-105 shadow-lg shadow-green-500/30"
                        : "bg-white/20 hover:bg-green-500 hover:scale-105"
                    }
                  `}
                >
                  {t}
                </button>

              
                {!isBooked && (
                  <p className="text-center text-xs mt-2 text-green-300">
                    💰 {pricePerHour} บาท
                  </p>
                )}

                
                {isBooked && (
                  <p className="text-center text-xs mt-2 text-red-400 font-semibold">
                    ❌ ถูกจองแล้ว
                  </p>
                )}

              </div>
            );
          })}
        </div>

        
        {selected && (
          <div className="mt-12 bg-white/10 border border-green-400/40 rounded-xl p-6 text-center">
            <p className="text-lg">
              วันที่: <span className="font-bold text-green-400">{date}</span>
            </p>
            <p className="text-lg">
              คุณเลือกเวลา: <span className="font-bold text-green-400">{selected}</span>
            </p>
            <p className="text-sm text-gray-300 mt-1">
              ราคา: {pricePerHour} บาท
            </p>
            <p className="text-sm text-gray-300 mt-1">
              คอร์ท: {court} 
            </p>
          </div>
        )}

       
        <div className="text-center mt-10">
          <button
            onClick={handleBooking}
            className="bg-green-500 hover:bg-green-600 px-10 py-4 rounded-full text-lg font-bold shadow-lg shadow-green-500/30 transition-all duration-300 hover:scale-105"
          >
            ✅ ยืนยันการจอง
          </button>
        </div>

      </div>
    </div>
  );
}

export default Booking;