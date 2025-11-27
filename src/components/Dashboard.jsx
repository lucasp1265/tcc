import React, { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, User, Stethoscope, Calendar as CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

const mockAppointments = [
  {
    id: '1',
    time: '09:00',
    patient: 'Maria Silva',
    type: 'Limpeza',
    professional: 'Dr. João',
    status: 'confirmado'
  },
  {
    id: '2',
    time: '10:30',
    patient: 'João Santos',
    type: 'Canal',
    professional: 'Dra. Ana',
    status: 'confirmado'
  },
  {
    id: '3',
    time: '14:00',
    patient: 'Ana Costa',
    type: 'Consulta',
    professional: 'Dr. João',
    status: 'pendente'
  },
  {
    id: '4',
    time: '15:30',
    patient: 'Carlos Lima',
    type: 'Extração',
    professional: 'Dr. Pedro',
    status: 'concluido'
  },
  {
    id: '5',
    time: '16:45',
    patient: 'Lucia Oliveira',
    type: 'Ortodontia',
    professional: 'Dra. Carla',
    status: 'confirmado'
  }
];

const mockStats = {
  totalPatients: 248,
  todayAppointments: 12,
  pending: 3,
  completedMonth: 156
};

const realAppointments = null;
const realStats = null;

export const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const appointments = realAppointments || mockAppointments;
  const stats = realStats || mockStats;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Painel de Controle</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon size={20} className="mr-2 text-blue-600" />
              Calendário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              locale={ptBR}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User size={20} className="mr-2 text-blue-600" />
              Resumo do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalPatients}</div>
                <div className="text-sm text-gray-600">Total de Pacientes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.todayAppointments}</div>
                <div className="text-sm text-gray-600">Agendamentos Hoje</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pendentes</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-1">{stats.completedMonth}</div>
                <div className="text-sm text-gray-600">Concluídos Este Mês</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Agendamentos Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Stethoscope className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedMonth}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
              <User className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="font-medium text-gray-700">Novo Paciente</div>
              <div className="text-sm text-gray-500">Cadastrar novo paciente</div>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
              <CalendarIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="font-medium text-gray-700">Agendar Consulta</div>
              <div className="text-sm text-gray-500">Novo agendamento</div>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
              <Stethoscope className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="font-medium text-gray-700">Novo Orçamento</div>
              <div className="text-sm text-gray-500">Criar orçamento</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};