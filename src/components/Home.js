import { Link } from "react-router-dom";
import { useState } from "react";

function Home() {
    const [openIndex, setOpenIndex] = useState(null);

const toggleAccordion = (index) => {
  setOpenIndex(openIndex === index ? null : index);
};
  return (
    <div className="pt-24 bg-gray-50 min-h-screen overflow-hidden">

      
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1626926938421-90124a4b83fa?q=80&w=1951&auto=format&fit=crop')",
        }}
      >
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

        
        <div className="relative z-10 text-center text-white px-6 max-w-4xl backdrop-blur-md bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            จองคอร์ทแบดมินตันง่าย ๆ <br />
            ภายใน 30 วินาที 🏸
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-10">
            เช็คตารางคอร์ทว่างแบบเรียลไทม์ จองออนไลน์
            และชำระเงินได้ทันที ทุกที่ ทุกเวลา
          </p>

          <div className="flex justify-center gap-6 flex-wrap">
            <Link
              to="/booking"
              className="bg-green-500 hover:bg-green-600 px-10 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-green-400/50 transition duration-300 hover:scale-105"
            >
              ➕ จองคอร์ทเลย
            </Link>

            <Link
              to="/board"
              className="border border-white px-10 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-black transition duration-300"
            >
              📅 ดูตารางคอร์ทว่าง
            </Link>
          </div>
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">ทำไมต้องจองกับเรา?</h2>
          <p className="text-gray-500">
            ระบบออกแบบมาเพื่อความสะดวก รวดเร็ว และทันสมัย
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[
            { icon: "⚡", title: "จองเร็วทันใจ", desc: "เลือกวัน เวลา และคอร์ทได้ทันที ไม่ต้องโทรจอง" },
            { icon: "💳", title: "ชำระเงินออนไลน์", desc: "ปลอดภัย ใช้งานง่าย ตรวจสอบสถานะได้ทันที" },
            { icon: "📊", title: "ดูประวัติได้ตลอด", desc: "ตรวจสอบการจองย้อนหลังและสถานะได้จาก Dashboard" },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-3xl shadow-md hover:shadow-2xl transition duration-500 hover:-translate-y-3 text-center border"
            >
              <div className="text-5xl mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      
<section className="bg-white py-24 px-6">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

   
    <div className="relative group">

      
      <img
        src="https://images.unsplash.com/photo-1626721105368-a69248e93b32?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="badminton"
        className="rounded-3xl shadow-2xl w-full h-[520px] object-cover transition duration-700 group-hover:scale-105"
      />

      
      <img
        src="https://images.unsplash.com/photo-1708312604109-16c0be9326cd?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="court"
        className="absolute -bottom-12 right-10 w-72 h-72 object-cover rounded-2xl border-8 border-white shadow-2xl transition duration-500 group-hover:scale-105"
      />
    </div>

    
    <div>
      <span className="text-green-600 font-semibold bg-green-100 px-4 py-1 rounded-full">
        เกี่ยวกับเรา
      </span>

      <h2 className="text-4xl font-bold mt-6 mb-6 leading-tight">
        รู้จักกับ เบิร์นเพลิน แบดมินตัน
      </h2>

      <p className="text-gray-600 leading-relaxed mb-6">
        สนามแบดคุณภาพมาตรฐานแข่งขัน เปิดให้บริการ
        <span className="text-green-600 font-semibold">
          {" "}จันทร์ - ศุกร์ 11:00 - 23:00 น.
        </span>
        และ
        <span className="text-green-600 font-semibold">
          {" "}เสาร์ - อาทิตย์ 10:00 - 23:00 น.
        </span>
        พร้อมพื้นสนาม PU มาตรฐาน 3 คอร์ท
        ระบบไฟส่องสว่างคุณภาพสูง
      </p>

      <p className="text-gray-600 leading-relaxed mb-10">
        มีที่จอดรถ ห้องน้ำสะอาด Wi-Fi ฟรี
        และระบบจองออนไลน์ที่สะดวกที่สุดในพื้นที่
      </p>

     
      <div className="grid grid-cols-2 gap-6 text-sm">

        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <p className="font-semibold mb-1">เบอร์โทรศัพท์</p>
          <p className="text-gray-600">012-345-6789</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <p className="font-semibold mb-1">Facebook</p>
          <p className="text-gray-600">burnplernbadminton</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <p className="font-semibold mb-1">LINE</p>
          <p className="text-gray-600">@burnplern888</p>
        </div>

        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <p className="font-semibold mb-1">จองออนไลน์</p>
          <p className="text-gray-600">burnplernbadminton.com</p>
        </div>

      </div>
    </div>

  </div>
</section>


<section className="relative bg-black text-white py-28 px-6 overflow-hidden">

  
  <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1626926938421-90124a4b83fa?q=80&w=1951&auto=format&fit=crop')] bg-cover bg-center"></div>

  <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">

    
    <div className="relative">

      <img
        src="https://images.unsplash.com/photo-1723633236252-eb7badabb34c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="badminton"
        className="rounded-3xl w-full h-[520px] object-cover shadow-2xl"
      />

     
      <img
        src="https://images.unsplash.com/photo-1765544581327-b5e9055d986c?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="court"
        className="absolute -left-10 top-20 w-56 h-56 rounded-2xl border-4 border-white shadow-2xl object-cover"
      />

      
      <div className="absolute -bottom-10 left-10 bg-green-600 px-10 py-6 rounded-2xl shadow-2xl flex items-center gap-6">
        <div className="text-4xl">🏸</div>
        <div>
          <p className="text-3xl font-bold">3</p>
          <p className="text-sm">คอร์ทมาตรฐาน</p>
        </div>
      </div>
    </div>

    
    <div>

      <span className="bg-white text-black px-4 py-1 rounded-full text-sm font-semibold">
        ดีแบดกับเราดียังไง ?
      </span>

      <h2 className="text-4xl font-bold mt-6 mb-6">
        ทำไมต้องเรา ?
      </h2>

      <p className="text-gray-300 leading-relaxed mb-10">
        สนามแบดมาตรฐาน 3 คอร์ท พร้อมสิ่งอำนวยความสะดวกครบครัน
        เปิดให้บริการทุกวัน และสามารถจองล่วงหน้าออนไลน์ได้ตลอด 24 ชั่วโมง
        <span className="text-green-500 font-semibold"> จองคอร์ทออนไลน์ง่าย ๆ </span>
      </p>

      
      <div className="space-y-4">

  {[
    {
      title: "เวลาทำการ",
      content: (
        <>
          จันทร์ - ศุกร์ 11:00 - 23:00 น. <br />
          เสาร์ - อาทิตย์ 10:00 - 23:00 น. <br />
          ติดต่อสอบถาม 012-345-6789
        </>
      ),
    },
    {
      title: "สิ่งอำนวยความสะดวกครบครัน",
      content: (
        <>
          ✔ ห้องอาบน้ำสะอาด <br />
          ✔ ที่จอดรถ 10 คัน <br />
          ✔ Wi-Fi ฟรี <br />
        </>
      ),
    },
    {
      title: "สิทธิประโยชน์สำหรับสมาชิก",
      content: (
        <>
          ✔ สะสมแต้มรับส่วนลด <br />
          ✔ โปรโมชันพิเศษรายเดือน <br />
          ✔ สิทธิ์จองล่วงหน้า
        </>
      ),
    },
  ].map((item, index) => (
    <div
      key={index}
      className="bg-zinc-900 rounded-xl border border-zinc-800 
hover:border-green-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] 
transition duration-300"
    >
     
      <button
        onClick={() => toggleAccordion(index)}
        className="w-full flex justify-between items-center p-6 text-left"
      >
        <span className="font-semibold">{item.title}</span>
        <span
          className={`transition-transform duration-300 ${
            openIndex === index ? "rotate-180 text-red-500" : ""
          }`}
        >
          ▼
        </span>
      </button>

     
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          openIndex === index
            ? "grid-rows-[1fr] opacity-100 p-6 pt-0"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden text-gray-400 text-sm leading-relaxed">
          {item.content}
        </div>
      </div>
    </div>
  ))}

</div>

    </div>
  </div>


  <div className="relative  max-w-6xl mx-auto mt-28 grid grid-cols-2 md:grid-cols-5 gap-10 text-center">

    {[
      { icon: "🏸", label: "คอร์ทมาตรฐาน", value: "3" },
      { icon: "🚿", label: "ห้องอาบน้ำ", value: "5" },
      { icon: "🏎️", label: "ที่จอดรถ", value: "10" },
      { icon: "❤️", label: "เครื่อง AED", value: "1" },
      { icon: "📹", label: "กล้องวงจรปิด", value: "24 ชม." },
    ].map((item, index) => (
      <div key={index}>
        <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center text-2xl">
          {item.icon}
        </div>
        <p className="text-2xl font-bold">{item.value}</p>
        <p className="text-gray-400 text-sm">{item.label}</p>
      </div>
    ))}

  </div>

</section>

      
      <section className="bg-gradient-to-r from-green-700 to-green-500 py-24 px-6 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16">
            เสียงจากลูกค้าของเรา
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              "ระบบจองง่ายมาก ไม่ต้องโทรถามคอร์ทว่างอีกต่อไป",
              "ชำระเงินสะดวกสุด ๆ จองแล้วไปเล่นได้เลย",
              "ดูตารางคอร์ทแบบเรียลไทม์ เฟี้ยวมากครับ",
            ].map((text, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-3xl border border-white/20 hover:bg-white/20 transition"
              >
                <p className="italic mb-6">"{text}"</p>
                <p className="font-bold">ลูกค้าประจำ ⭐⭐⭐⭐</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      <section className="py-24 text-center bg-gray-900 text-white">
        <h2 className="text-4xl font-bold mb-6">
          พร้อมจะลงสนามแล้วหรือยัง?
        </h2>

        <Link
          to="/booking"
          className="bg-gradient-to-r from-green-500 to-green-600 px-12 py-5 rounded-full text-lg font-semibold shadow-xl hover:scale-105 hover:shadow-green-400/40 transition duration-300"
        >
           เริ่มจองตอนนี้
        </Link>
      </section>

    </div>
  );
}

export default Home;