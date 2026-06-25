import { useEffect, useState } from 'react'
import { useTasks } from '../Context/Taskcontext'
import Header from '../Components/Header'
import { toast } from 'react-toastify'
import { FiTrash2, FiRotateCcw, FiAlertTriangle } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const tagStyle = {
  urgent:    'text-red-600 bg-red-50 border border-red-200',
  important: 'text-violet-600 bg-violet-50 border border-violet-200',
  normal:    'text-emerald-600 bg-emerald-50 border border-emerald-200',
}

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000)
  if (secs < 60) return 'just now'
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`
  return `${Math.floor(secs / 86400)}d ago`
}

export default function Trash() {
  const { trashedTasks, trashLoading, fetchTrashedTasks, restoreTask } = useTasks()
  const [confirmEmptyOpen, setConfirmEmptyOpen] = useState(false)
  const [confirmPermId, setConfirmPermId] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => { fetchTrashedTasks() }, [fetchTrashedTasks])

  const handleRestore = async (id) => {
    try {
      await restoreTask(id)
      toast.success('Task restored to My Tasks')
    } catch {
      toast.error('Failed to restore task')
    }
  }

//   const handlePermanentDelete = async (id) => {
//     try {
//       await permanentDelete(id)
//       setConfirmPermId(null)
//       toast.success('Task permanently deleted')
//     } catch {
//       toast.error('Failed to delete task')
//     }
//   }

//   const handleEmptyTrash = async () => {
//     setBusy(true)
//     try {
//       await emptyTrash()
//       setConfirmEmptyOpen(false)
//       toast.success('Trash emptied')
//     } catch {
//       toast.error('Failed to empty trash')
//     } finally {
//       setBusy(false)
//     }
//   }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <FiTrash2 size={20} className="text-red-400" />
              <h1 className="text-2xl font-bold text-gray-900">Recycle bin</h1>
            </div>
            <p className="text-sm text-gray-400 mt-0.5">
              {trashedTasks.length} deleted task{trashedTasks.length !== 1 ? 's' : ''} · Items here are not permanently deleted
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Link to="/mytask">
              <button className="text-sm font-semibold text-gray-500 hover:text-[#7c18c9] px-3 py-2 rounded-lg hover:bg-violet-50 transition border border-gray-200">
                 My Tasks
              </button>
            </Link>
          </div>
        </div>

        {/* Empty trash confirm banner */}
        {confirmEmptyOpen && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
            <FiAlertTriangle size={20} className="text-[#974FD0] mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-[#974FD0]">Permanently delete all {trashedTasks.length} trashed task{trashedTasks.length !== 1 ? 's' : ''}?</p>
              <p className="text-xs text-[#974FD0] mt-0.5">This cannot be undone.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={handleEmptyTrash} disabled={busy}
                className="px-4 py-1.5 bg-[#974FD0] text-white text-xs font-bold rounded-lg hover:bg-[#7c18c9] transition disabled:opacity-50">
                {busy ? 'Deleting…' : 'Delete all'}
              </button>
              <button onClick={() => setConfirmEmptyOpen(false)}
                className="px-4 py-1.5 bg-white text-gray-500 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {trashLoading && (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-2 border-red-300 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading trash...</p>
          </div>
        )}

        {!trashLoading && trashedTasks.length === 0 && (
          <div className="text-center py-24 text-gray-300">
            <FiTrash2 size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm font-medium text-gray-400">Your trash is empty</p>
            <p className="text-xs text-gray-300 mt-1">Deleted tasks will appear here</p>
          </div>
        )}

        <div className="space-y-3">
          {trashedTasks.map(task => (
            <div key={task._id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm opacity-80 hover:opacity-100 transition">

              {/* Permanent delete confirm */}
              {confirmPermId === task._id ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <FiAlertTriangle size={18} className="text-red-400 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-700">Permanently delete this task?</p>
                      <p className="text-xs text-red-400 mt-0.5">This action cannot be undone.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handlePermanentDelete(task._id)}
                      className="px-5 py-2 bg-[#974FD0] text-white text-xs font-bold rounded-lg hover:bg-[#7c18c9] transition">
                      Delete forever
                    </button>
                    <button onClick={() => setConfirmPermId(null)}
                      className="px-5 py-2 bg-gray-100 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-200 transition">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${tagStyle[task.tag] || tagStyle.normal}`}>
                        {task.tag}
                      </span>
                      <span className="text-xs text-gray-300">Trashed {timeAgo(task.deletedAt)}</span>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleRestore(task._id)}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 text-[#7c18c9] border border-[#7c18c9] rounded-lg hover:bg-violet-50 transition">
                        <FiRotateCcw size={11} /> Restore
                      </button>
                      <button onClick={() => setConfirmPermId(task._id)}
                        className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 text-[#974FD0] border border-[#974FD0] rounded-lg hover:bg-violet-50 transition">
                        <FiTrash2 size={11} /> Delete
                      </button>
                    </div>
                  </div>
                  <h2 className="font-bold text-gray-500 mb-1 line-through">{task.title}</h2>
                  <p className="text-sm text-gray-400 leading-relaxed">{task.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
