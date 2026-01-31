import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './layouts/Layout';
import Landing from './pages/Landing';
import Todo from './pages/Todo';
import Timer from './pages/Timer';
import Diary from './pages/Diary';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          <Route path="todo" element={
            <ProtectedRoute>
              <Todo />
            </ProtectedRoute>
          } />
          <Route path="timer" element={
            <ProtectedRoute>
              <Timer />
            </ProtectedRoute>
          } />
          <Route path="diary" element={
            <ProtectedRoute>
              <Diary />
            </ProtectedRoute>
          } />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
