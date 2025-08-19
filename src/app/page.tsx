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
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, done: !done })
      })
      fetchTodos()
    } catch (error) {
      console.error('Failed to toggle todo:', error)
    }
  }

  async function updateTodo(id: string, newTitle: string) {
    if (!newTitle.trim()) return
    
    try {
      await fetch('/api/todos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: newTitle.trim() })
      })
      setEditingId(null)
      setEditingTitle('')
      fetchTodos()
    } catch (error) {
      console.error('Failed to update todo:', error)
    }
  }

  async function deleteTodo(id: string) {
    if (!confirm('Delete this todo?')) return
    
    try {
      await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      fetchTodos()
    } catch (error) {
      console.error('Failed to delete todo:', error)
    }
  }

  function startEdit(todo: Todo) {
    setEditingId(todo.id)
    setEditingTitle(todo.title)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingTitle('')
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '40px auto', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        color: '#000000',
        fontSize: '28px',
        fontWeight: '600'
      }}>
        Todo List
      </h1>
      
      <form onSubmit={addTodo} style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '30px' 
      }}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add new todo..."
          style={{
            flex: 1,
            padding: '12px',
            border: '2px solid #000000',
            borderRadius: '4px',
            fontSize: '16px',
            outline: 'none',
            backgroundColor: '#ffffff'
          }}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 20px',
            backgroundColor: loading ? '#cccccc' : '#000000',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>

      {todos.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          color: '#666666', 
          fontSize: '18px',
          padding: '40px 0'
        }}>
          No todos yet. Add your first one!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {todos.map((todo) => (
            <div
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                border: '1px solid #000000',
                borderRadius: '4px',
                backgroundColor: '#ffffff'
              }}
            >
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id, todo.done)}
                style={{ 
                  width: '18px', 
                  height: '18px',
                  cursor: 'pointer'
                }}
              />
              
              {editingId === todo.id ? (
                <div style={{ flex: 1, display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      border: '1px solid #000000',
                      borderRadius: '4px',
                      fontSize: '16px',
                      outline: 'none'
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') updateTodo(todo.id, editingTitle)
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => updateTodo(todo.id, editingTitle)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#666666',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onClick={() => startEdit(todo)}
                    style={{
                      flex: 1,
                      fontSize: '16px',
                      color: todo.done ? '#999999' : '#000000',
                      textDecoration: todo.done ? 'line-through' : 'none',
                      cursor: 'pointer'
                    }}
                    title="Click to edit"
                  >
                    {todo.title}
                  </span>
                  
                  <button
                    onClick={() => startEdit(todo)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#666666',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#000000',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      
      {todos.length > 0 && (
        <div style={{ 
          marginTop: '30px', 
          textAlign: 'center',
          padding: '16px',
          backgroundColor: '#f8f8f8',
          borderRadius: '4px',
          border: '1px solid #000000',
          color: '#000000'
        }}>
          Total: {todos.length} | 
          Completed: {todos.filter(t => t.done).length} | 
          Remaining: {todos.filter(t => !t.done).length}
        </div>
      )}
    </div>
  )
}