import { Link } from "react-router-dom";

function Pricing() {
  const plans = [
    {
      name: "Walk-In",
      price: "฿120 / ชม.",
      features: [
        "จองคอร์ทตามเวลาที่ว่าง",
        "ไม่ต้องเป็นสมาชิก",
        "ชำระเงินที่สนามทันที",
      ],
      color: "border-gray-300",
      button: "bg-gray-700 text-white",
    },
    {
      name: "Member",
      price: "฿100 / ชม.",
      features: [
        "ราคาพิเศษสำหรับสมาชิก",
        "เก็บแต้มสะสม",
        "สิทธิพิเศษอื่น ๆ",
      ],
      color: "border-green-500",
      popular: true,
      button: "bg-green-500 text-white",
    },
    {
      name: "Package",
      price: "฿900 / 10 ชม.",
      features: [
        "แพ็กเกจคุ้มสุด",
        "ใช้เวลาจองได้ยืดหยุ่น",
        "ประหยัดกว่า จ่ายครั้งเดียว",
      ],
      color: "border-purple-500",
      button: "bg-purple-500 text-white",
    },
  ];

  return (
    <div className="pt-24 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-3">
            ราคาและแพ็กเกจ
          </h2>
          <p className="text-gray-600 text-lg">
            เลือกแบบที่เหมาะกับคุณ
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-10">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`border-2 ${plan.color} rounded-2xl p-8 bg-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300`}
            >
              {plan.popular && (
                <div className="text-center mb-4">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                    ⭐ แนะนำ
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold mb-4 text-center">
                {plan.name}
              </h3>

              <p className="text-center text-3xl font-extrabold mb-6 text-gray-800">
                {plan.price}
              </p>

              <ul className="space-y-3 mb-8 text-gray-700">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-500 text-lg">✔</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Link
                  to="/booking"
                  className={`${plan.button} px-6 py-3 rounded-full font-semibold hover:opacity-90 hover:scale-105 transition inline-block`}
                >
                  จองแพ็กเกจนี้
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Terms Section */}
        <div className="py-16">
          <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-10 text-gray-700 leading-8">

            <h3 className="text-2xl font-bold mb-6 text-center">
              เงื่อนไขการใช้บริการสนาม
            </h3>

            <ol className="list-decimal pl-6 space-y-4">

              <li>
                การจองคอร์ทออนไลน์ ทาง เว็บไซต์ : 
                <span className="text-green-600 font-semibold">
                  https://burnplernbadminton.vercel.app
                </span>
                มีเวลาจำกัด 5 นาทีในการทำการจองในระบบ และ 
                <span className="text-green-500 font-semibold">
                  ต้องโอนชำระเงินล่วงหน้าเต็มจำนวนทันที พร้อมแนบหลักฐานการโอนชำระเงิน ภายใน 30 นาที
                </span>
                นับตั้งแต่เวลาที่ลูกค้าจองคอร์ท หากเกินเวลาที่กำหนด ระบบจะทำการยกเลิกการจองทันที
              </li>

              <li>
                จองคอร์ทล่วงหน้าก่อนเวลาเล่น อย่างน้อย 1 ชั่วโมง และ 
                <span className="text-green-500 font-semibold">
                  ต้องชำระเงินล่วงหน้าเต็มจำนวนทันที เมื่่อทำการจองคอร์ท
                </span>
                ลูกค้าต้องส่งหลักฐานการโอนชำระเงิน 
                <span className="text-green-500 font-semibold">
                  ภายใน 30 นาที
                </span>
                นับตั้งแต่เวลาที่ลูกค้าจองคอร์ท
              </li>

              <li>
                ภายใน 1 วัน สามารถจองคอร์ทล่วงหน้าได้ 6 ชั่วโมง และสามารถจองล่วงหน้าได้สูงสุด 1 เดือน
              </li>

              <li>
                ทางสนาม ขอสงวนสิทธิ์ในการคืนเงินค่าบริการสนาม ทุกกรณี
              </li>

              <li>
                ลูกค้าต้องการเปลี่ยน, เลื่อน, ย้ายวันหรือเวลาที่จองสนามไว้ 
                <span className="text-green-500 font-semibold">
                  ต้องแจ้งพนักงาน ล่วงหน้าอย่างน้อย 1 วัน ก่อนเวลา 23.00 น.
                </span>
                และสามารถเปลี่ยนได้เพียง 1 ครั้ง

                <div className="mt-3 space-y-2 pl-6">
                  <div className="text-sm">
                    <span className="font-semibold">**</span> หากอัตราค่าบริการใหม่สูงกว่าเดิม ทางสนามขอเก็บค่าบริการส่วนต่าง
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">**</span> หากอัตราค่าบริการใหม่ต่ำกว่าเดิม ทางสนามขอสงวนสิทธิ์ไม่คืนเงินส่วนต่าง
                  </div>
                </div>
              </li>

              <li>
                ลูกค้ามาเกินเวลาที่จองเล่น ทางสนามขอสงวนสิทธิ์ในการปิดไฟสนามตามเวลาที่จองไว้
              </li>

              <li>
                ต้องการรับใบกำกับภาษีแบบเต็มรูปแบบ กรุณาติดต่อเจ้าหน้าที่ (ภายในวันที่ชำระเงิน)
              </li>

              <li>
                กรุณาแต่งกายด้วยชุดกีฬาสุภาพ และสวมรองเท้าสำหรับกีฬาแบดมินตัน
              </li>

              <li>
                ขอความร่วมมือลูกค้าเข้ามาในสนามตามเวลาที่จองไว้ เพื่อไม่รบกวนลูกค้าท่านอื่น
              </li>

              <li>
                เมื่อสิ้นสุดเวลาการจอง ลูกค้าจะต้องออกจากสนาม เพื่อให้ลูกค้าท่านต่อไปเข้าใช้บริการ
              </li>

            </ol>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Pricing;