import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User } from './types';
import { initializeData } from './mockData';
import { Login } from './Login';
import { DashboardCitizen } from './DashboardCitizen';
import { DashboardAdmin } from './DashboardAdmin';
import { DashboardOfficer } from './DashboardOfficer';
import { Settings } from './Settings';
import { AddOfficer } from './AddOfficer';
import { LogOut, Home, Settings as SettingsIcon, UserIcon, UserPlus } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'settings' | 'addOfficer'>('home');

  useEffect(() => {
    initializeData();
    const storedUser = localStorage.getItem('ccfms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('ccfms_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    localStorage.removeItem('ccfms_user');
  };

  const handleUserUpdate = (u: User) => {
    setUser(u);
  };

  return (
    <BrowserRouter>
      <div className="app-layout">
        {user ? (
          <>
            <aside className="sidebar">
              <div className="sidebar-header mb-4">
                <h2 className="logo-text">CCFMS</h2>
              </div>

              <nav className="sidebar-nav">
                <button 
                  className={`btn ${currentView === 'home' ? 'active' : ''}`}
                  onClick={() => setCurrentView('home')}
                >
                  <Home size={18} /> Dashboard
                </button>
                <button 
                  className={`btn ${currentView === 'settings' ? 'active' : ''}`}
                  onClick={() => setCurrentView('settings')}
                >
                  <SettingsIcon size={18} /> Settings
                </button>
                {user.role === 'Admin' && (
                  <button 
                    className={`btn ${currentView === 'addOfficer' ? 'active' : ''}`}
                    onClick={() => setCurrentView('addOfficer')}
                  >
                    <UserPlus size={18} /> Add Officer
                  </button>
                )}
              </nav>

              <div className="sidebar-footer">
                <div className="profile-summary">
                  <div className="avatar">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon size={20} color="white" />
                    )}
                  </div>
                  <div className="user-details flex-1">
                    <div className="font-bold text-sm" style={{color: 'white'}}>{user.name}</div>
                    <div className="subtitle" style={{fontSize: '0.8rem'}}>{user.role} {user.category && `(${user.category})`}</div>
                  </div>
                </div>
                <button onClick={handleLogout} className="btn logout w-full justify-center mt-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </aside>
            <main className="main-content">
               {currentView === 'settings' ? (
                 <Settings user={user} onUpdate={handleUserUpdate} />
               ) : currentView === 'addOfficer' && user.role === 'Admin' ? (
                 <AddOfficer />
               ) : (
                 <Routes>
                    <Route path="/" element={<Navigate to={`/${user.role.toLowerCase()}`} replace />} />
                    <Route path="/citizen" element={
                    user.role === 'Citizen' ? <DashboardCitizen user={user} /> : <Navigate to="/" replace />
                    } />
                    <Route path="/admin" element={
                    user.role === 'Admin' ? <DashboardAdmin user={user} /> : <Navigate to="/" replace />
                    } />
                    <Route path="/officer" element={
                    user.role === 'Officer' ? <DashboardOfficer user={user} /> : <Navigate to="/" replace />
                    } />
                 </Routes>
               )}
            </main>
          </>
        ) : (
          <main className="main-content flex items-center justify-center p-0">
             <Routes>
               <Route path="*" element={<Login onLogin={handleLogin} />} />
             </Routes>
          </main>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
