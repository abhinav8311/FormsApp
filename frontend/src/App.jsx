import React from 'react'
import { Route,Routes,Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Form from './pages/Form';

function App() {

  return (
     <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/formbuilder" element={<Form />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
        </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App;
