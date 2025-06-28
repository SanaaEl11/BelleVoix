import './index.css';

import Navbar from './pages/Navbar/Navbar';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from './firebase';
import { useState, useEffect } from 'react';

import AdminDashboard from './pages/AdminDashboard';
import AddStudentForm from './pages/admin/AddStudentForm';
import StudentTable from './pages/admin/StudentTable';
import PaymentSection from './pages/admin/PaymentSection';
import AddPayment from './pages/admin/AddPayment';

// Protected Route Component
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Vérification de l'authentification...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route path="students/add" element={<AddStudentForm />} />
          <Route path="students/list" element={<StudentTable />} />
          <Route path="students/payments" element={<PaymentSection />} />
          <Route path="students/payments/add" element={<AddPayment />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;