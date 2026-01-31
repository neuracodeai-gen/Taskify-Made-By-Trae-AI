import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Settings, X, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { clsx } from 'clsx';

// Simple beep sound using Web Audio API
const playNotificationSound = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
  
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

const Timer = () => {
  // Settings State
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('timer_settings');
    return saved ? JSON.parse(saved) : {
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      autoStartBreaks: true,
      autoStartWork: true,
    };
  });

  // Timer State
  const [mode, setMode] = useState('work'); // 'work', 'short', 'long'
  const [timeLeft, setTimeLeft] = useState(settings.workDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef(null);

  // Persist settings
  useEffect(() => {
    localStorage.setItem('timer_settings', JSON.stringify(settings));
  }, [settings]);

  // Handle Mode Changes and Auto-transitions
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    if (soundEnabled) playNotificationSound();
    
    if (mode === 'work') {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      
      if (newCycles % settings.longBreakInterval === 0) {
        switchMode('long');
      } else {
        switchMode('short');
      }
    } else {
      switchMode('work');
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    const duration = 
      newMode === 'work' ? settings.workDuration :
      newMode === 'short' ? settings.shortBreakDuration :
      settings.longBreakDuration;
      
    setTimeLeft(duration * 60);

    // Auto-start logic
    if (newMode === 'work' && settings.autoStartWork) {
      setIsActive(true);
    } else if (newMode !== 'work' && settings.autoStartBreaks) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    const duration = 
      mode === 'work' ? settings.workDuration :
      mode === 'short' ? settings.shortBreakDuration :
      settings.longBreakDuration;
    setTimeLeft(duration * 60);
  };

  const skipTimer = () => {
    setIsActive(false);
    handleTimerComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = 
      (mode === 'work' ? settings.workDuration :
      mode === 'short' ? settings.shortBreakDuration :
      settings.longBreakDuration) * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };

  // Color themes based on mode
  const theme = {
    work: { text: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', ring: 'ring-indigo-500' },
    short: { text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', ring: 'ring-teal-500' },
    long: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-500' },
  };

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Header & Controls */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-2">
          {['work', 'short', 'long'].map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={clsx(
                'px-4 py-2 rounded-full text-sm font-medium transition-all capitalize',
                mode === m
                  ? `${theme[m].bg} ${theme[m].text} shadow-sm ring-1 ring-inset ${theme[m].border}`
                  : 'text-gray-500 hover:bg-gray-100'
              )}
            >
              {m === 'short' ? 'Short Break' : m === 'long' ? 'Long Break' : 'Focus'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative w-72 h-72 flex items-center justify-center">
          {/* Progress Circle Background */}
          <div className="absolute inset-0 rounded-full border-8 border-gray-100"></div>
          {/* Progress Circle Indicator (Simple SVG implementation) */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="289"
              strokeDashoffset={289 - (289 * getProgress()) / 100}
              className={clsx('transition-all duration-1000', theme[mode].text)}
            />
          </svg>
          
          <div className="relative text-center z-10">
            <div className={clsx('text-7xl font-mono font-bold tracking-tighter mb-2', theme[mode].text)}>
              {formatTime(timeLeft)}
            </div>
            <p className={clsx('text-sm font-medium uppercase tracking-widest opacity-60', theme[mode].text)}>
              {isActive ? 'Running' : 'Paused'}
            </p>
          </div>
        </div>

        {/* Cycle Indicators */}
        <div className="mt-8 flex items-center gap-2">
          <span className="text-sm text-gray-400 font-medium mr-2">Cycles</span>
          {[...Array(settings.longBreakInterval)].map((_, i) => (
            <div
              key={i}
              className={clsx(
                'w-3 h-3 rounded-full transition-colors',
                i < cycles % settings.longBreakInterval 
                  ? 'bg-indigo-500' 
                  : 'bg-gray-200'
              )}
            />
          ))}
          <span className="text-xs text-gray-400 ml-2">({cycles} total)</span>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-6">
          <button
            onClick={toggleTimer}
            className={clsx(
              "p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 flex items-center justify-center",
              isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-indigo-600 hover:bg-indigo-700"
            )}
          >
            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current pl-1" />}
          </button>
          
          <div className="flex gap-4">
             <button
              onClick={resetTimer}
              className="p-4 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
            <button
              onClick={skipTimer}
              className="p-4 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Skip Interval"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Timer Settings
              </h3>
              <button 
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Durations (minutes)</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Focus</label>
                    <input
                      type="number"
                      value={settings.workDuration}
                      onChange={(e) => setSettings({...settings, workDuration: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Short Break</label>
                    <input
                      type="number"
                      value={settings.shortBreakDuration}
                      onChange={(e) => setSettings({...settings, shortBreakDuration: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Long Break</label>
                    <input
                      type="number"
                      value={settings.longBreakDuration}
                      onChange={(e) => setSettings({...settings, longBreakDuration: Number(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Configuration</p>
                
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Long Break Interval</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={settings.longBreakInterval}
                    onChange={(e) => setSettings({...settings, longBreakInterval: Number(e.target.value)})}
                    className="w-20 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Auto-start Breaks</label>
                  <input
                    type="checkbox"
                    checked={settings.autoStartBreaks}
                    onChange={(e) => setSettings({...settings, autoStartBreaks: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Auto-start Work</label>
                  <input
                    type="checkbox"
                    checked={settings.autoStartWork}
                    onChange={(e) => setSettings({...settings, autoStartWork: e.target.checked})}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
