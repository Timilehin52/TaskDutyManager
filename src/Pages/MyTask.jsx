import { useState } from 'react'
import { useTasks } from '../Context/Taskcontext'
import { Link } from 'react-router-dom'
import Header from '../Components/Header'
import { toast } from 'react-toastify'
import { FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi'

const tagStyle = {
  urgent:    'text-red-600 bg-red-50 border border-red-200',
  important: 'text-violet-600 bg-violet-50 border border-violet-200',
  normal:    'text-emerald-600 bg-emerald-50 border border-emerald-200',
}

export default function MyTasks() {
  const { tasks, editTask, deleteTask, loading, error } = useTasks()
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  const startEdit = (task) => {
    setEditingId(task._id)
    setEditForm({ title: task.title, description: task.description, tag: task.tag })
  }

  const saveEdit = async (id) => {
    if (!editForm.title.trim()) return
    setSaving(true)
    try {
      await editTask(id, editForm)
      setEditingId(null)
      toast.success('Task updated')
    } catch (e) {
      toast.error('Failed to update task')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      setConfirmDeleteId(null)
      toast.success('Task moved to trash')
    } catch (e) {
      toast.error('Failed to move task to trash')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-400 mt-0.5">{tasks.length} active task{tasks.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/trash">
              <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-[#974FD0] hover:bg-gray-200 px-3 py-2 rounded-lg transition border border-gray-200">
                <FiTrash2 size={14} /> Trash
              </button>
            </Link>
            <Link to="/newtask">
              <button className="flex items-center gap-1.5 text-sm font-bold text-white bg-[#7c18c9] hover:bg-[#2D0050] px-4 py-2 rounded-lg transition">
                Add New Task
              </button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-[#13071c] text-sm px-4 py-3 rounded-xl mb-4">⚠️ {error}</div>
        )}

        {loading && (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-2 border-[#7c18c9] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading tasks...</p>
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="text-center py-24 text-gray-300">
            <FiCheck size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No tasks yet. Add your first one!</p>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map(task => (
            <div key={task._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">

              {/* Edit mode */}
              {editingId === task._id ? (
                <div className="flex flex-col gap-3">
                  <input
                    value={editForm.title}
                    onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7c18c9] transition font-medium"
                    placeholder="Task title"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                    rows={3}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7c18c9] transition resize-none"
                    placeholder="Description"
                  />
                  <select
                    value={editForm.tag}
                    onChange={e => setEditForm({ ...editForm, tag: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-[#7c18c9] transition"
                  >
                    <option value="urgent">Urgent</option>
                    <option value="important">Important</option>
                    <option value="normal">Normal</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={() => saveEdit(task._id)} disabled={saving}
                      className="px-5 py-2 bg-[#7c18c9] text-white text-xs font-bold rounded-lg hover:bg-[#2D0050] transition disabled:opacity-50">
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="px-5 py-2 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-200 transition">
                      Cancel
                    </button>
                  </div>
                </div>

              /* Confirm delete prompt */
              ) : confirmDeleteId === task._id ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <FiTrash2 size={18} className="text-[#974FD0] shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#974FD0]">Move to trash?</p>
                      <p className="text-xs text-[#974FD0] mt-0.5">You can restore it from the Trash page anytime.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDelete(task._id)}
                      className="px-5 py-2 bg-[#974FD0] text-white text-xs font-bold rounded-lg hover:bg-[#7c18c9] transition">
                      Yes, trash it
                    </button>
                    <button onClick={() => setConfirmDeleteId(null)}
                      className="px-5 py-2 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-200 transition">
                      Keep it
                    </button>
                  </div>
                </div>

              /* Normal view */
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${tagStyle[task.tag] || tagStyle.normal}`}>
                      {task.tag}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => startEdit(task)}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-[#7c18c9] text-white rounded-lg hover:bg-[#2D0050] transition">
                        <FiEdit2 size={11} /> Edit
                      </button>
                      <button onClick={() => setConfirmDeleteId(task._id)}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 text-[#974FD0] border border-[#974FD0] rounded-lg hover:bg-violet-50 transition">
                        <FiTrash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                  <h2 className="font-bold text-gray-900 mb-1">{task.title}</h2>
                  <p className="text-sm text-gray-500 leading-relaxed">{task.description}</p>
                  <p className="text-xs text-gray-300 mt-3">{new Date(task.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
