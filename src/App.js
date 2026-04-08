// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot/Chatbot';
import Home from './pages/Home';
import Convert from './pages/Convert';
import { Login, Signup } from './pages/Auth';
import Pricing from './pages/Pricing';
import Tools from './pages/Tools';
import './index.css';

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/convert" element={<Layout><Convert /></Layout>} />
          <Route path="/tools" element={<Layout><Tools /></Layout>} />
          <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          <Route path="*" element={
            <Layout>
              <div style={{ textAlign: 'center', padding: '80px 24px' }}>
                <h1 style={{ fontSize: 48, fontFamily: 'var(--font-display)', color: 'var(--gray-900)', marginBottom: 12 }}>404</h1>
                <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>Page not found</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </Layout>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
