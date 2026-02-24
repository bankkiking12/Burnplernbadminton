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

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

 
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


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

 
  const navbarBg =
    isHome && !scrolled
      ? "bg-transparent"
      : "bg-white/90 backdrop-blur-lg shadow-md";

  const navbarText =
    isHome && !scrolled
      ? "text-black"
      : "text-gray-900";

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${navbarBg}`}
    >
      <div
        className={`max-w-7xl mx-auto px-6 transition-all duration-300 ${
          scrolled ? "py-3" : "py-5"
        } flex justify-between items-center ${navbarText}`}
      >
      
        <div className="space-x-6 font-semibold">
          <Link to="/" className="hover:text-green-500 transition">
            Home
          </Link>
          <Link to="/pricing" className="hover:text-green-500 transition">
            Pricing
          </Link>
          <Link to="/booking" className="hover:text-green-500 transition">
            Booking
          </Link>
          <Link to="/board" className="hover:text-green-500 transition">
            Court Availability
          </Link>
        </div>

        <div className="relative" ref={dropdownRef}>
          {!user ? (
            <Link
              to="/login"
              className="hover:text-green-500 transition font-semibold"
            >
              Login
            </Link>
          ) : (
            <div className="flex items-center space-x-4">
             
              <div
                onClick={() => setOpen(!open)}
                className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer font-bold text-white"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  getInitial(user.email)
                )}
              </div>

              
              {open && (
                <div className="absolute right-0 top-14 w-52 bg-white text-gray-900 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    👤 Dashboard
                  </Link>

                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                  >
                    📖 MyBookings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;