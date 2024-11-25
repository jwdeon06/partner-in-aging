import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Guide from './pages/Guide';
import Store from './pages/Store';
import Library from './pages/Library';
import Connect from './pages/Connect';
import Profile from './pages/Profile';
import AccountInfo from './pages/profile/AccountInfo';
import PersonalInfo from './pages/profile/PersonalInfo';
import Login from './pages/Login';
import Register from './pages/Register';
import EditPost from './pages/EditPost';
import CreatePost from './pages/CreatePost';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import AdminChat from './pages/connect/AdminChat';
import CommunityGroup from './pages/connect/CommunityGroup';
import CreateGroup from './pages/connect/CreateGroup';
import CarePlanEditor from './pages/CarePlanEditor';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8)_0%,transparent_75%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(46,144,255,0.15)_0%,transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_100%,rgba(75,200,152,0.1)_0%,transparent_60%)]"></div>
      </div>
      
      <Navbar />
      <main className="container mx-auto px-4 py-8 relative">
        <Routes>
          <Route path="/" element={<Guide />} />
          <Route path="/store" element={<Store />} />
          <Route path="/library" element={<Library />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/connect/admin-chat" element={
            <ProtectedRoute>
              <AdminChat />
            </ProtectedRoute>
          } />
          <Route path="/connect/group/:groupId" element={
            <ProtectedRoute>
              <CommunityGroup />
            </ProtectedRoute>
          } />
          <Route path="/connect/create-group" element={
            <ProtectedRoute requireRole="admin">
              <CreateGroup />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/account" element={<AccountInfo />} />
          <Route path="/profile/personal" element={<PersonalInfo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={
            <ProtectedRoute requireRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/edit-post/:id" element={
            <ProtectedRoute requireRole="admin">
              <EditPost />
            </ProtectedRoute>
          } />
          <Route path="/create-post" element={
            <ProtectedRoute requireRole="admin">
              <CreatePost />
            </ProtectedRoute>
          } />
          <Route path="/admin/care-plans/create" element={
            <ProtectedRoute requireRole="admin">
              <CarePlanEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/care-plans/edit/:id" element={
            <ProtectedRoute requireRole="admin">
              <CarePlanEditor />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'rounded-lg shadow-md',
          style: {
            background: '#F9FAFB',
            color: '#111827',
            border: '1px solid #E5E7EB'
          },
          success: {
            style: {
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534'
            }
          },
          error: {
            style: {
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B'
            }
          }
        }}
      />
    </div>
  );
}

export default App;