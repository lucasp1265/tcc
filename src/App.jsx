import './App.css'
import React, { useState } from 'react';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Patients } from './components/Patients';
import { Procedures } from './components/Procedures';
import { Scheduling } from './components/Scheduling';
import { Professionals } from './components/Professionals';
import { Budgets } from './components/Budgets';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogin = (email, password) => {
    if (email && password) {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        onLogout={handleLogout} 
      />
      
      <main className="pt-20">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'patients' && <Patients />}
        {activeTab === 'procedures' && <Procedures />}
        {activeTab === 'scheduling' && <Scheduling />}
        {activeTab === 'professionals' && <Professionals />}
        {activeTab === 'budgets' && <Budgets />}
      </main>
    </div>
  );
}
