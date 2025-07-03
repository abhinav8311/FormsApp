import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import Form from './pages/Form';
import Layout from './components/Layout';
import FormResponses from './pages/FormResponses';

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route 
        path="/formbuilder" 
        element={
          <ProtectedRoute>
            <Layout><Form /></Layout>
          </ProtectedRoute>
        } />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Layout><Home /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/responses/:formId"
        element={
          <ProtectedRoute>
            <Layout><FormResponses /></Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

export default App;
