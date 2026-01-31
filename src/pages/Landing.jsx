import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Clock, Book, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="space-y-16 py-10">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Master your day with <span className="text-indigo-600">Taskify</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          The all-in-one minimalistic productivity workspace. Manage tasks, focus with timers, and reflect on your progress.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/todo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          to="/todo"
          icon={CheckSquare}
          title="To-Do List"
          description="Stay organized with a simple and effective task manager. Prioritize and track your daily goals."
          color="bg-blue-50 text-blue-600"
        />
        <FeatureCard
          to="/timer"
          icon={Clock}
          title="Focus Timer"
          description="Boost productivity with a built-in focus timer. Work in intervals and maintain your flow."
          color="bg-orange-50 text-orange-600"
        />
        <FeatureCard
          to="/diary"
          icon={Book}
          title="Daily Diary"
          description="Reflect on your day, jot down thoughts, and keep a personal journal of your journey."
          color="bg-green-50 text-green-600"
        />
      </section>
    </div>
  );
};

const FeatureCard = ({ to, icon: Icon, title, description, color }) => (
  <Link
    to={to}
    className="block p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
      {title}
    </h3>
    <p className="text-gray-600 leading-relaxed">
      {description}
    </p>
  </Link>
);

export default Landing;
