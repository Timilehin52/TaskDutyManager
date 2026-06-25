import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const API_BASE = '/api/tasks'

const TaskContext = createContext()

const getToken = () => localStorage.getItem('token')

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
})

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([])
  const [trashedTasks, setTrashedTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [trashLoading, setTrashLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    if (!getToken()) return          
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_BASE, { headers: authHeaders() })
      if (res.status === 401) { setTasks([]); return }
      if (!res.ok) throw new Error('Failed to fetch tasks')
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTrashedTasks = useCallback(async () => {
    if (!getToken()) return          
    setTrashLoading(true)
    //setError(null)
    try {
      const res = await fetch(`${API_BASE}/trash`, { headers: authHeaders() })
      if (res.status === 401) { setTrashedTasks([]); return }
      if (!res.ok) throw new Error('Failed to fetch trashed tasks')
      const data = await res.json()
      setTrashedTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setTrashLoading(false)
    }
  }, [])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const addTask = async (task) => {
    setError(null)
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        tag: task.tag?.toLowerCase() || 'normal',
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to create task')
    }
    const newTask = await res.json()
    setTasks(prev => [newTask, ...prev])
    return newTask
  }

  const editTask = async (id, data) => {
    setError(null)
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        title: data.title,
        description: data.description,
        tag: data.tag?.toLowerCase(),
      }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message || 'Failed to update task')
    }
    const updated = await res.json()
    setTasks(prev => prev.map(t => t._id === id ? updated : t))
    return updated
  }

   // Soft delete — moves to trash
  const deleteTask = async (id) => {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE', headers: authHeaders() })
    if (!res.ok) throw new Error('Failed to move task to trash')
    const { task } = await res.json()
    setTasks(prev => prev.filter(t => t._id !== id))
    setTrashedTasks(prev => [task, ...prev])
  }



  // Restore from trash
  const restoreTask = async (id) => {
    const res = await fetch(`${API_BASE}/trash/${id}/restore`, { method: 'PUT', headers: authHeaders() })
    if (!res.ok) throw new Error('Failed to restore task')
    const { task } = await res.json()
    setTrashedTasks(prev => prev.filter(t => t._id !== id))
    setTasks(prev => [task, ...prev])
  }


  

  // Called after login so tasks load immediately without a page refresh
  const reloadTasks = () => fetchTasks()

  return (
    <TaskContext.Provider value={{ tasks, loading, error, addTask, editTask, deleteTask, fetchTasks, reloadTasks, restoreTask, trashedTasks, trashLoading, fetchTrashedTasks }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => useContext(TaskContext)
