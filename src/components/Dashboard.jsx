import React, { useState, useEffect } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Clock, User, Stethoscope, Calendar as CalendarIcon, Activity, TrendingUp, Plus } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

export const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState({
    totalPatients: 0,
    appointmentsOnDate: 0,
    monthAppointments: 0,
    budgetsOnDate: 0
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

        // Agendamentos do dia
        const appsOnDate = schedules.filter(s => s.date === dateStr);
        
        // Agendamentos do mês
        const appsInMonth = schedules.filter(s => {
          const sDate = new Date(s.date + 'T00:00:00');
          return sDate.getMonth() === currentMonth && sDate.getFullYear() === currentYear;
        }).length;

        // Orçamentos do dia
        const budgetsOnDate = budgets.filter(b => b.date === dateStr).length;

        // Total de Interações (Pacientes Ativos no sistema através de agendamentos ou orçamentos)
        const totalInteractions = schedules.length + budgets.length;

        setStats({
          totalPatients: totalInteractions, 
          appointmentsOnDate: appsOnDate.length,
          monthAppointments: appsInMonth,
          budgetsOnDate: budgetsOnDate
        });

        const enrichedApps = appsOnDate.map(app => {
          const patient = patients.find(p => p.id === app.patient);
          return { 
            id: app.id,
            time: app.startTime ? app.startTime.substring(0, 5) : (app.time ? app.time.substring(0, 5) : "00:00"),
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Esquerda: Calendário + Ações Rápidas */}
        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon size={20} className="mr-2 text-blue-600" />
                Calendário
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                locale={ptBR}
                className="rounded-md border mx-auto"
              />
            </CardContent>
          </Card>

          {/* Ações Rápidas Restauradas e Posicionadas aqui para preencher espaço */}
          <div className="grid grid-cols-1 gap-3">
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all flex items-center shadow-sm group">
              <div className="p-2 bg-blue-100 rounded-full mr-3 text-blue-600 group-hover:bg-blue-200 transition-colors">
                <User size={20} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Novo Paciente</div>
                <div className="text-xs text-gray-500">Cadastrar ficha completa</div>
              </div>
            </button>
            
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all flex items-center shadow-sm group">
              <div className="p-2 bg-green-100 rounded-full mr-3 text-green-600 group-hover:bg-green-200 transition-colors">
                <CalendarIcon size={20} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Agendar Consulta</div>
                <div className="text-xs text-gray-500">Marcar horário na agenda</div>
              </div>
            </button>
            
            <button className="p-4 bg-white border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-300 transition-all flex items-center shadow-sm group">
              <div className="p-2 bg-yellow-100 rounded-full mr-3 text-yellow-600 group-hover:bg-yellow-200 transition-colors">
                <Stethoscope size={20} />
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-800">Novo Orçamento</div>
                <div className="text-xs text-gray-500">Criar avaliação financeira</div>
              </div>
            </button>
          </div>
        </div>

        {/* Coluna Direita: Resumo + Lista de Atividades */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cards de Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{stats.totalPatients}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Total Interações</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">{stats.appointmentsOnDate}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Agenda Dia</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">{stats.monthAppointments}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Agenda Mês</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-1">{stats.budgetsOnDate}</div>
                <div className="text-xs text-gray-500 uppercase font-semibold">Orçamentos Dia</div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Atividades do Dia */}
          <Card className="h-full min-h-[400px]">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity size={20} className="mr-2 text-gray-600" />
                  Agenda de {selectedDate.toLocaleDateString('pt-BR')}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dayActivity.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <Clock className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                    <p>Nenhum agendamento para esta data.</p>
                  </div>
                ) : (
                  dayActivity.map((apt, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors shadow-sm border-l-4 border-l-blue-500 bg-white">
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[3rem]">
                          <span className="block text-lg font-bold text-blue-600">{apt.time}</span>
                        </div>
                        <div className="h-8 w-px bg-gray-200"></div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">{apt.patientName}</p>
                          <p className="text-xs text-gray-500">Consulta Agendada</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">
                        Confirmado
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};