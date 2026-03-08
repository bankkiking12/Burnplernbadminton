import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // เช็คว่าล็อกอินอยู่แล้วไหม
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/booking");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);

      await Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        text: "ยินดีต้อนรับ 🎉",
        confirmButtonColor: "#2563eb",
      });

      navigate("/booking");
    } catch (err) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }

    setLoading(false);
  };

  // RESET PASSWORD (Demo)
  const handleResetPassword = async () => {
    setError("");

    if (!email || !newPassword) {
      setError("กรุณากรอกอีเมลและรหัสใหม่");
      return;
    }

    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);

      if (methods.length === 0) {
        setError("ไม่พบบัญชีผู้ใช้นี้");
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "เปลี่ยนรหัสผ่านสำเร็จ",
        text: "ระบบทำงานในโหมด Demo",
        confirmButtonColor: "#16a34a",
      });

      setResetMode(false);
      setNewPassword("");
      setPassword("");
    } catch (err) {
      setError("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-3xl font-bold mb-6 text-center">
          {resetMode ? "รีเซ็ตรหัสผ่าน" : "เข้าสู่ระบบ"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded text-sm text-center">
            {error}
          </div>
        )}

        {!resetMode ? (
          <>
            <form onSubmit={handleLogin}>

              {/* EMAIL */}
              <input
                type="email"
                placeholder="อีเมล"
                className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* PASSWORD */}
              <div className="relative mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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

              {/* FORGOT PASSWORD */}
              <div className="text-right mb-5">
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
              </button>

            </form>

            <p className="text-center mt-6 text-sm">
              ยังไม่มีบัญชี?{" "}
              <Link to="/register" className="text-blue-500 hover:underline font-semibold">
                สมัครสมาชิก
              </Link>
            </p>
          </>
        ) : (
          <>
            {/* RESET MODE */}

            <input
              type="email"
              placeholder="อีเมล"
              className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="รหัสใหม่"
              className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              เปลี่ยนรหัสผ่าน
            </button>

            <button
              onClick={() => setResetMode(false)}
              className="w-full mt-4 text-sm text-gray-500 hover:underline"
            >
              กลับไปหน้าเข้าสู่ระบบ
            </button>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;