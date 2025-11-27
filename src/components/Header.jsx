import React from 'react';
import { ToothIcon } from './ToothIcon';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

const mockTabs = [
  { id: 'dashboard', label: 'Painel' },
  { id: 'patients', label: 'Pacientes' },
  { id: 'procedures', label: 'Procedimentos' },
  { id: 'scheduling', label: 'Agendamentos' },
  { id: 'professionals', label: 'Profissionais' },
  { id: 'budgets', label: 'Orçamentos' },
];

const realTabs = null;

export const Header = ({ activeTab, onTabChange, onLogout }) => {
  const tabs = realTabs || mockTabs;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <ToothIcon size={28} color="#2563eb" />
              <h1 className="text-xl font-semibold text-blue-900">DentalCare Pro</h1>
            </div>
          </div>

          <nav className="flex items-center space-x-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-2 transition-all hover-lift ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </nav>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-gray-700 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};