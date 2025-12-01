import React, { useState, useEffect } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Clock, User, Stethoscope, Calendar as CalendarIcon, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

export const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsOnDate: 0,
    monthAppointments: 0,
    totalBudgets: 0
  });
  const [dayActivity, setDayActivity] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = import.meta.env.VITE_API_URL;

      const [patRes, schedRes, budgRes] = await Promise.all([
        fetch(`${apiUrl}/patients/`, { headers }),
        fetch(`${apiUrl}/schedules/`, { headers }),
        fetch(`${apiUrl}/budgets/`, { headers })
      ]);

      if (patRes.ok && schedRes.ok && budgRes.ok) {
        const patients = await patRes.json();
        const schedules = await schedRes.json();
        const budgets = await budgRes.json();

        const dateStr = selectedDate.toISOString().split('T')[0];
        const currentMonth = selectedDate.getMonth();
        const currentYear = selectedDate.getFullYear();

        const appsOnDate = schedules.filter(s => s.date === dateStr);
        
        const appsInMonth = schedules.filter(s => {
          const sDate = new Date(s.date + 'T00:00:00');
          return sDate.getMonth() === currentMonth && sDate.getFullYear() === currentYear;
        }).length;

        const budgetsOnDate = budgets.filter(b => b.date === dateStr).length;
        const totalInteractions = schedules.length + budgets.length;

        setStats({
          totalPatients: totalInteractions, 
          appointmentsOnDate: appsOnDate.length,
          monthAppointments: appsInMonth,
          totalBudgets: budgetsOnDate
        });

        const enrichedApps = appsOnDate.map(app => {
          const patient = patients.find(p => p.id === app.patient);
          return { 
            id: app.id,
            time: app.time.substring(0, 5),
            patientName: patient ? patient.name : 'Desconhecido',
            type: 'Consulta'
          };
        });
        
        enrichedApps.sort((a, b) => a.time.localeCompare(b.time));
        setDayActivity(enrichedApps);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Painel de Controle</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Card Principal: Calendário + Resumo do Dia */}
        <Card className="overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Lado Esquerdo: Calendário */}
            <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100 flex justify-center items-start bg-gray-50/50 lg:w-1/3">
              <div className="w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-700">
                  <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
                  Selecione uma Data
                </h3>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  locale={ptBR}
                  className="rounded-md border bg-white shadow-sm mx-auto"
                />
              </div>
            </div>

            {/* Lado Direito: Resumo e Lista */}
            <div className="p-6 lg:w-2/3">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Visão Geral do Dia
                  </h3>
                  <p className="text-gray-500">
                    {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{stats.appointmentsOnDate}</p>
                    <p className="text-xs text-gray-500 uppercase">Agendamentos</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">{stats.totalBudgets}</p>
                    <p className="text-xs text-gray-500 uppercase">Orçamentos</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Agenda do Dia</h4>
                
                {dayActivity.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                    <Clock className="h-10 w-10 text-gray-300 mb-2" />
                    <p className="text-gray-500 font-medium">Nenhum agendamento para hoje</p>
                    <p className="text-sm text-gray-400">Selecione outra data ou adicione um novo</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dayActivity.map((apt) => (
                      <div key={apt.id} className="flex items-center p-3 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                        <div className="mr-4 text-center min-w-[3rem]">
                          <span className="block text-lg font-bold text-gray-800">{apt.time}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{apt.patientName}</p>
                          <p className="text-xs text-gray-500">{apt.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Cards de Métricas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Pacientes/Interações</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <User size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Atendimentos no Mês</p>
                <p className="text-3xl font-bold text-gray-900">{stats.monthAppointments}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <Activity size={24} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Ações Rápidas</p>
                <div className="flex gap-2 mt-2">
                  <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Novo Paciente</button>
                  <button className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Novo Agendamento</button>
                </div>
              </div>
              <div className="p-3 bg-gray-100 rounded-full text-gray-600">
                <Stethoscope size={24} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};