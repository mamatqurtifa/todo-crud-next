'use client'

import { useEffect, useState } from 'react'

interface Todo {
  id: string
  title: string
  done: boolean
  createdAt: string
  updatedAt: string
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  async function fetchTodos() {
    try {
      const res = await fetch('/api/todos')
      if (res.ok) {
        const data = await res.json()
        setTodos(data)
      }
    } catch (error) {
      console.error('Failed to fetch todos:', error)
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() })
      })

      if (res.ok) {
        setTitle('')
        fetchTodos()
      }
    } catch (error) {
      console.error('Failed to add todo:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleTodo(id: string, done: boolean) {
    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, done: !done })
      })

      if (res.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  async function updateTodoTitle(id: string, newTitle: string) {
    if (!newTitle.trim()) return

    try {
      const res = await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: newTitle.trim() })
      })

      if (res.ok) {
        setEditingId(null)
        setEditingTitle('')
        fetchTodos()
      }
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  async function deleteTodo(id: string) {
    if (!confirm('Yakin ingin menghapus todo ini?')) return

    try {
      const res = await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        fetchTodos()
      }
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditingTitle('')
  }

  return (
    <main className="max-w-2xl mx-auto mt-8 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Todo App
        </h1>
        <p className="text-gray-600">
          Built with Next.js, Prisma & Neon
        </p>
      </div>
      
      <form onSubmit={addTodo} className="mb-8 flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tambah todo baru..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Adding...' : 'Tambah'}
        </button>
      </form>

      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-500 text-lg">
              Belum ada todo. Tambahkan yang pertama!
            </p>
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id, todo.done)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              
              {editingId === todo.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        updateTodoTitle(todo.id, editingTitle)
                      }
                      if (e.key === 'Escape') {
                        cancelEditing()
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => updateTodoTitle(todo.id, editingTitle)}
                    className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    ✓
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 cursor-pointer ${
                      todo.done 
                        ? 'line-through text-gray-500' 
                        : 'text-gray-900'
                    }`}
                    onDoubleClick={() => startEditing(todo)}
                    title="Double click to edit"
                  >
                    {todo.title}
                  </span>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(todo)}
                      className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
      
      {todos.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total: {todos.length} todos</span>
            <span>Completed: {todos.filter(t => t.done).length}</span>
            <span>Remaining: {todos.filter(t => !t.done).length}</span>
          </div>
        </div>
      )}
    </main>
  )
}