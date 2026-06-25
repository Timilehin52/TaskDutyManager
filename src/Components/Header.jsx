import { useContext } from 'react'
import Taskduty from "../assets/Taskduty.png"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext'
import { useTasks } from '../Context/Taskcontext'
import { toast } from 'react-toastify'

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, token, logout } = useContext(AuthContext)
  const { reloadTasks } = useTasks()
  const isHome = location.pathname === '/'

  const handleLogout = () => {
    logout()
    toast.success("Logged out successfully")
    navigate("/login")
  }

  return (
    <div className="px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
      <nav className="flex items-center justify-between max-w-6xl mx-auto">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Taskduty} alt="TaskDuty" className="w-7 h-7" />
          <span className="text-[#2D0050] font-bold text-lg">TaskDuty</span>
        </Link>

        {/* Nav links + user info */}
        <div className="flex items-center gap-4">
          {isHome && token && (
            <Link to="/newtask">
              <span className="text-sm font-medium text-gray-600 hover:text-[#7c18c9] transition">
                New Task
              </span>
            </Link>
          )}
          {token && (
            <Link to="/mytask">
              <span className="text-sm font-medium text-gray-600 hover:text-[#7c18c9] transition">
                All Tasks
              </span>
            </Link>
          )}

          {token && user ? (
            <div className="flex items-center gap-3">
              {/* Avatar + name */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#ba76ed] flex items-center justify-center text-white text-xs font-bold select-none">
                  {user.lastName?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-700 hidden sm:inline">
                  Mr {user.lastName}
                </span>
              </div>
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="text-xs font-bold px-3 py-1.5 border border-[#7c18c9] text-[#7c18c9] rounded-lg hover:bg-violet-50 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <button className="text-xs font-bold px-3 py-1.5 border border-[#7c18c9] text-[#7c18c9] rounded-lg hover:bg-violet-50 transition">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="text-xs font-bold px-3 py-1.5 bg-[#7c18c9] text-white rounded-lg hover:bg-[#2D0050] transition">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
