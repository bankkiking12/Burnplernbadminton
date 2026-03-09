import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useRef } from "react";

function Navbar() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const isHome = location.pathname === "/";

  // auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close dropdown when click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  const getInitial = (email) => {
    return email ? email.charAt(0).toUpperCase() : "?";
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Spacer กัน Navbar ทับ content */}
      <div className="h-20"></div>

      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isHome && !scrolled
            ? "bg-transparent"
            : "bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg"
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-500 ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide text-gray-900"
          >
            Burnplern Badminton
          </Link>

          {/* Menu */}
          <div className="hidden md:flex space-x-8 font-semibold">
            {[
              { name: "Home", path: "/" },
              { name: "Pricing", path: "/pricing" },
              { name: "Booking", path: "/booking" },
              { name: "Court", path: "/board" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative transition duration-300 ${
                  isActive(item.path)
                    ? "text-green-600"
                    : "text-gray-800 hover:text-green-500"
                }`}
              >
                {item.name}

                {/* underline animation */}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-green-500 transition-all duration-300 ${
                    isActive(item.path)
                      ? "w-full"
                      : "w-0 group-hover:w-full"
                  }`}
                ></span>
              </Link>
            ))}
          </div>

          {/* User Section */}
          <div className="relative" ref={dropdownRef}>
            {!user ? (
              <Link
                to="/login"
                className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:bg-green-600 hover:scale-105 transition duration-300"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div
                  onClick={() => setOpen(!open)}
                  className="w-11 h-11 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center cursor-pointer font-bold text-white shadow-md hover:scale-110 transition duration-300"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  ) : (
                    getInitial(user.email)
                  )}
                </div>

                {/* Dropdown */}
                {open && (
                  <div className="absolute right-0 top-14 w-56 bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                    <Link
                      to="/dashboard"
                      className="block px-5 py-3 hover:bg-gray-100 transition"
                    >
                       Dashboard
                    </Link>

                    <Link
                      to="/my-bookings"
                      className="block px-5 py-3 hover:bg-gray-100 transition"
                    >
                       My Bookings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 transition"
                    >
                       Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;