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
  const navigate = useNavigate();

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/booking");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

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
  };

  
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {resetMode ? "รีเซ็ตรหัสผ่าน" : "เข้าสู่ระบบ"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        {!resetMode ? (
          <>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="อีเมล"
                className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="relative mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="รหัสผ่าน"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-500"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-sm text-blue-500 hover:underline"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
              >
                เข้าสู่ระบบ
              </button>
            </form>

            <p className="text-center mt-4 text-sm">
              ยังไม่มีบัญชี?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                สมัครสมาชิก
              </Link>
            </p>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="อีเมล"
              className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="รหัสใหม่"
              className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              onClick={handleResetPassword}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
            >
              เปลี่ยนรหัสผ่าน
            </button>

            <button
              onClick={() => setResetMode(false)}
              className="w-full mt-3 text-sm text-gray-500 hover:underline"
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