import { useEffect, useState, useCallback } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

function AvailabilityBoard() {
  const [date, setDate] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const courts = ["1", "2", "3"];

  const times = [
    "08:00 - 09:00","09:00 - 10:00","10:00 - 11:00","11:00 - 12:00",
    "12:00 - 13:00","13:00 - 14:00","14:00 - 15:00","15:00 - 16:00",
    "16:00 - 17:00","17:00 - 18:00","18:00 - 19:00","19:00 - 20:00",
    "20:00 - 21:00","21:00 - 22:00",
  ];

  const fetchBookings = useCallback(async () => {

    if (!date) {
      setBookings([]);
      return;
    }

    setLoading(true);

    try {

      const q = query(
        collection(db, "bookings"),
        where("date", "==", date)
      );

      const res = await getDocs(q);

      setBookings(res.docs.map((d) => d.data()));

    } catch (error) {

      console.error("Error fetching bookings:", error);

    }

    setLoading(false);

  }, [date]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const isBooked = (court, time) => {
    return bookings.some(
      (b) => b.court === court && b.time === time
    );
  };

  const getAvailableCount = (time) => {
    return courts.filter((court) => !isBooked(court, time)).length;
  };

  const totalAvailable = times.reduce(
    (acc, time) => acc + getAvailableCount(time),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 md:p-20 text-white">

      <div className="max-w-7xl mx-auto backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10">

        {/* HEADER */}

        <div className="text-center mb-10">

          <h1 className="text-4xl font-bold tracking-wide mb-2">
            📅 ตารางคอร์ทว่าง
          </h1>

          <p className="text-gray-400 text-sm">
            ตรวจสอบเวลาคอร์ทว่างก่อนทำการจอง
          </p>

        </div>

        {/* DATE PICKER */}

        <div className="flex justify-center mb-8">

          <input
            type="date"
            className="bg-white text-gray-800 border border-gray-300 p-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

        </div>

        {/* LEGEND */}

        {date && (
          <div className="flex justify-center gap-6 mb-6 text-sm">

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-green-500 rounded-full"></span>
              ว่าง
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500 rounded-full"></span>
              เต็ม
            </div>

          </div>
        )}

        {/* SUMMARY */}

        {date && (
          <div className="text-center mb-6 text-green-400 font-semibold">
            คอร์ทว่างทั้งหมดวันนี้ : {totalAvailable} ช่องเวลา
          </div>
        )}

        {/* LOADING */}

        {loading && (
          <div className="text-center text-gray-300 mb-6">
            กำลังโหลดข้อมูล...
          </div>
        )}

        {/* TABLE */}

        {date && !loading && (
          <div className="overflow-x-auto rounded-2xl">

            <table className="min-w-full text-sm text-center border-separate border-spacing-0">

              <thead>

                <tr>

                  <th className="p-4 bg-white/20 backdrop-blur-md rounded-tl-2xl">
                    เวลา
                  </th>

                  {courts.map((court) => (
                    <th
                      key={court}
                      className="p-4 bg-white/20 backdrop-blur-md"
                    >
                      คอร์ท {court}
                    </th>
                  ))}

                  <th className="p-4 bg-white/20 backdrop-blur-md rounded-tr-2xl">
                    ว่าง
                  </th>

                </tr>

              </thead>

              <tbody>

                {times.map((time) => (

                  <tr key={time} className="hover:bg-white/5 transition">

                    <td className="p-4 font-semibold bg-white/5">
                      {time}
                    </td>

                    {courts.map((court) => {

                      const booked = isBooked(court, time);

                      return (

                        <td key={court} className="p-4">

                          <span
                            className={`px-4 py-2 rounded-full text-xs font-semibold ${
                              booked
                                ? "bg-red-500 text-white"
                                : "bg-green-500 text-white"
                            }`}
                          >

                            {booked ? "เต็ม" : "ว่าง"}

                          </span>

                        </td>

                      );

                    })}

                    <td className="p-4 font-bold text-green-400">
                      {getAvailableCount(time)} คอร์ท
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default AvailabilityBoard;