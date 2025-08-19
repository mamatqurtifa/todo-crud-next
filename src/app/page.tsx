'use client'

import { useState } from 'react'

interface Todo {
  id: string
  title: string
  done: boolean
}

export default function SimpleTodoApp() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')

  function addTodo(e: React.MouseEvent | React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      title: title.trim(),
      done: false
    }

    setTodos([...todos, newTodo])
    setTitle('')
  }

  function toggleTodo(id: string) {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  function deleteTodo(id: string) {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Todo List</h1>
        
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add new todo..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addTodo(e)
                }
              }}
            />
            <button
              onClick={addTodo}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No todos yet</p>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded"
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4"
                />
                
                <span
                  className={`flex-1 ${
                    todo.done 
                      ? 'line-through text-gray-500' 
                      : 'text-black'
                  }`}
                >
                  {todo.title}
                </span>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
        
        {todos.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600 text-center">
            {todos.filter(t => t.done).length} of {todos.length} completed
          </div>
        )}
      </div>
    </div>
  )
}