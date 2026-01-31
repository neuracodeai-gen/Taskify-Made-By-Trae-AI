import React, { useState, useEffect } from 'react';
import { Save, Calendar, Trash2, Plus } from 'lucide-react';

const Diary = () => {
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('diary_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentEntry, setCurrentEntry] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('diary_entries', JSON.stringify(entries));
  }, [entries]);

  const saveEntry = () => {
    if (!currentEntry.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      timestamp: new Date().toISOString(),
      content: currentEntry,
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry('');
    setIsEditing(false);
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Personal Diary</h2>
        <p className="text-gray-500">Reflect on your journey</p>
      </div>

      {!isEditing && (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          Write a new entry
        </button>
      )}

      {isEditing && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-center text-gray-500 text-sm">
                <span>Today</span>
                <button onClick={() => setIsEditing(false)} className="hover:text-red-500">Cancel</button>
            </div>
          <textarea
            value={currentEntry}
            onChange={(e) => setCurrentEntry(e.target.value)}
            placeholder="How was your day?"
            className="w-full h-40 resize-none p-4 rounded-lg bg-gray-50 border-0 focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            autoFocus
          />
          <div className="flex justify-end">
            <button
              onClick={saveEntry}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Save className="w-4 h-4" />
              Save Entry
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {entries.map((entry) => (
          <div key={entry.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <Calendar className="w-4 h-4" />
                {entry.date}
              </div>
              <button
                onClick={() => deleteEntry(entry.id)}
                className="text-gray-300 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed font-serif">
              {entry.content}
            </p>
          </div>
        ))}
        
        {entries.length === 0 && !isEditing && (
             <div className="text-center py-10 text-gray-400">
                Your diary is empty. Start writing today!
             </div>
        )}
      </div>
    </div>
  );
};

export default Diary;
