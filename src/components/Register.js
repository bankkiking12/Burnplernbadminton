import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // เก็บข้อมูลเพิ่มใน Firestore
      await setDoc(doc(db, "users", user.uid), {
        name,
        email,
        role: "member",
        createdAt: new Date(),
      });

      await Swal.fire({
        icon: "success",
        title: "สมัครสมาชิกสำเร็จ 🎉",
        text: "ยินดีต้อนรับเข้าสู่ระบบ",
        confirmButtonColor: "#16a34a",
      });

      navigate("/booking");

    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          สมัครสมาชิก
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        {/* NAME */}
        <input
          type="text"
          placeholder="ชื่อ"
          className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="อีเมล"
          className="w-full border p-3 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <div className="relative mb-6">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="รหัสผ่าน"
            className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500 text-lg"
          >
            {showPassword ? "🙈" : "👁"}
          </button>

        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>

        {/* LOGIN LINK */}
        <p className="text-center mt-6 text-sm">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:underline font-semibold"
          >
            เข้าสู่ระบบ
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;