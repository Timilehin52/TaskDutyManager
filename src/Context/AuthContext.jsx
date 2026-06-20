import { createContext, useState, useContext } from "react"
import axios from "axios"
import PropTypes from "prop-types"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem("token"))

  const _persist = (userData, tok) => {
    setUser(userData)
    setToken(tok)
    localStorage.setItem("token", tok)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const SignUp = async (formData) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_AUTH_BASE_URL}/signup`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      )
      return data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  const SignIn = async (formData) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_AUTH_BASE_URL}/signin`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      )
      _persist(data.user, data.token)
      return data
    } catch (error) {
      throw error.response?.data || error
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ SignUp, SignIn, user, token, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

AuthProvider.propTypes = { children: PropTypes.node.isRequired }
