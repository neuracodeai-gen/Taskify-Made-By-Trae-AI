import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { clsx } from 'clsx';

const Todo = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>
        <p className="text-gray-500">Keep track of your daily goals</p>
      </div>

      <form onSubmit={addTask} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task..."
          className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-lg"
        />
        <button
          type="submit"
          className="absolute right-3 top-3 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </form>

      <div className="flex gap-2 justify-center">
        {['all', 'active', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={clsx(
              'px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors',
              filter === f
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-500 hover:bg-gray-100'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No tasks found. Time to add some!
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
            >
              <button
                onClick={() => toggleTask(task.id)}
                className={clsx(
                  'flex-shrink-0 transition-colors',
                  task.completed ? 'text-green-500' : 'text-gray-300 hover:text-indigo-500'
                )}
              >
                {task.completed ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </button>
              <span
                className={clsx(
                  'flex-grow text-lg transition-all',
                  task.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                )}
              >
                {task.text}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Todo;
