import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative mt-24 bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">

      {/* Top Glow Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-green-400 via-emerald-500 to-green-400"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid md:grid-cols-4 gap-12">

        {/* Logo Section */}
        <div>
          <h2 className="text-2xl font-bold tracking-wide mb-4">
            Burnplern Badminton
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Premium Badminton Court Booking Platform.
            ระบบจองสนามที่ทันสมัย รวดเร็ว ใช้งานง่าย
            และออกแบบมาเพื่อประสบการณ์ระดับพรีเมียม
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-green-400 font-semibold mb-5">
            Navigation
          </h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>
              <Link to="/" className="hover:text-white transition duration-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-white transition duration-300">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-white transition duration-300">
                Booking
              </Link>
            </li>
            <li>
              <Link to="/board" className="hover:text-white transition duration-300">
                Court Availability
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="text-green-400 font-semibold mb-5">
            Account
          </h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>
              <Link to="/login" className="hover:text-white transition duration-300">
                Login
              </Link>
            </li>
            <li>
              <Link to="/my-bookings" className="hover:text-white transition duration-300">
                My Bookings
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="hover:text-white transition duration-300">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-green-400 font-semibold mb-5">
            Contact
          </h3>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li>📍 Bangkok, Thailand</li>
            <li>📞 012-345-6789</li>
            <li>
              <a
                href="mailto:support@trumq.com"
                className="hover:text-white transition duration-300"
              >
                https://burnplernbadminton.vercel.app
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Burnplern Badminton. All rights reserved.</p>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition duration-300">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition duration-300">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}

export default Footer;