import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Homepage from './Pages/Homepage'
import NewTask from './Pages/NewTask'
import MyTasks from './Pages/MyTask'
import TaskForm from './Components/TaskForm'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        {/* Protected routes */}
        <Route path='/' element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
        <Route path='/newtask' element={<ProtectedRoute><NewTask /></ProtectedRoute>} />
        <Route path='/taskform' element={<ProtectedRoute><TaskForm /></ProtectedRoute>} />
        <Route path='/mytask' element={<ProtectedRoute><MyTasks /></ProtectedRoute>} />

        
        <Route path='*' element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
