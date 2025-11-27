import React, { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CalendarDays, Clock, Plus, User } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

const mockAppointments = [
  {
    id: '1',
    date: '2024-12-25',
    time: '09:00',
    patient: 'Maria Silva',
    professional: 'Dr. João',
    procedure: 'Limpeza Dental',
    status: 'confirmado'
  },
  {
    id: '2',
    date: '2024-12-25',
    time: '10:30',
    patient: 'João Santos',
    professional: 'Dra. Ana',
    procedure: 'Canal',
    status: 'agendado'
  },
  {
    id: '3',
    date: '2024-12-25',
    time: '14:00',
    patient: 'Ana Costa',
    professional: 'Dr. João',
    procedure: 'Consulta',
    status: 'confirmado'
  },
  {
    id: '4',
    date: '2024-12-26',
    time: '09:30',
    patient: 'Carlos Lima',
    professional: 'Dr. Pedro',
    procedure: 'Extração',
    status: 'agendado'
  },
  {
    id: '5',
    date: '2024-12-26',
    time: '15:30',
    patient: 'Lúcia Oliveira',
    professional: 'Dra. Carla',
    procedure: 'Ortodontia',
    status: 'confirmado'
  }
];

const mockTimeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00'
];

const mockPatients = ['Maria Silva', 'João Santos', 'Ana Costa', 'Carlos Lima', 'Lúcia Oliveira'];
const mockProfessionals = ['Dr. João', 'Dra. Ana', 'Dr. Pedro', 'Dra. Carla'];
const mockProcedures = ['Limpeza Dental', 'Canal', 'Consulta', 'Extração', 'Ortodontia'];

const realAppointments = null;
const realPatients = null;
const realProfessionals = null;
const realProcedures = null;
const realTimeSlots = null;

export const Scheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState(realAppointments || mockAppointments);
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [newAppointment, setNewAppointment] = useState({});
  const [view, setView] = useState('daily');

  const patientsList = realPatients || mockPatients;
  const professionalsList = realProfessionals || mockProfessionals;
  const proceduresList = realProcedures || mockProcedures;
  const timeSlotsList = realTimeSlots || mockTimeSlots;

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayAppointments = appointments.filter(apt => apt.date === selectedDateStr);

  const getWeekDays = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(selectedDate);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'agendado':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-gray-100 text-gray-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNewAppointment = () => {
    setNewAppointment({
      date: selectedDateStr,
      status: 'agendado'
    });
    setIsNewAppointmentOpen(true);
  };

  const handleSaveAppointment = () => {
    if (newAppointment.time && newAppointment.patient && newAppointment.professional && newAppointment.procedure) {
      const appointment = {
        id: Date.now().toString(),
        date: newAppointment.date || selectedDateStr,
        time: newAppointment.time,
        patient: newAppointment.patient,
        professional: newAppointment.professional,
        procedure: newAppointment.procedure,
        status: newAppointment.status || 'agendado',
        notes: newAppointment.notes
      };
      
      setAppointments([...appointments, appointment]);
      setIsNewAppointmentOpen(false);
      setNewAppointment({});
    }
  };

  const getDayName = (day) => {
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dayNames[day.getDay()];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Agendamentos</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={view === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('daily')}
            >
              Diário
            </Button>
            <Button
              variant={view === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('weekly')}
            >
              Semanal
            </Button>
          </div>
          <Button onClick={handleNewAppointment} className="bg-blue-600 hover:bg-blue-700 hover-lift">
            <Plus size={16} className="mr-2" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarDays size={20} className="mr-2 text-blue-600" />
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

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock size={20} className="mr-2 text-blue-600" />
                {view === 'daily' ? `Agendamentos para ${selectedDate.toLocaleDateString('pt-BR')}` : 'Agenda Semanal'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {view === 'daily' ? (
              <div className="space-y-4">
                {dayAppointments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum agendamento para este dia
                  </div>
                ) : (
                  dayAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover-lift"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                            <Clock size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.time}</p>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User size={14} />
                              <span>{appointment.patient}</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {appointment.procedure} • {appointment.professional}
                            </p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                    ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-4">
                {weekDays.map((day, index) => {
                  const dayStr = day.toISOString().split('T')[0];
                  const dayAppointments = appointments.filter(apt => apt.date === dayStr);
                  
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-center mb-2">
                        {getDayName(day)}
                      </h4>
                      <p className="text-sm text-gray-500 text-center mb-3">
                        {day.getDate()}
                      </p>
                      <div className="space-y-2">
                        {dayAppointments
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((appointment) => (
                            <div
                              key={appointment.id}
                              className="p-2 bg-blue-50 rounded text-xs"
                            >
                              <p className="font-medium">{appointment.time}</p>
                              <p className="text-gray-600 truncate">{appointment.patient}</p>
                              <Badge className={`${getStatusColor(appointment.status)} text-xs`}>
                                {appointment.status}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={newAppointment.date || selectedDateStr}
                onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Horário</Label>
              <Select
                value={newAppointment.time}
                onValueChange={(value) => setNewAppointment({...newAppointment, time: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o horário" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlotsList.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Paciente</Label>
              <Select
                value={newAppointment.patient}
                onValueChange={(value) => setNewAppointment({...newAppointment, patient: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o paciente" />
                </SelectTrigger>
                <SelectContent>
                  {patientsList.map((patient) => (
                    <SelectItem key={patient} value={patient}>
                      {patient}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Profissional</Label>
              <Select
                value={newAppointment.professional}
                onValueChange={(value) => setNewAppointment({...newAppointment, professional: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o profissional" />
                </SelectTrigger>
                <SelectContent>
                  {professionalsList.map((professional) => (
                    <SelectItem key={professional} value={professional}>
                      {professional}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Procedimento</Label>
              <Select
                value={newAppointment.procedure}
                onValueChange={(value) => setNewAppointment({...newAppointment, procedure: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o procedimento" />
                </SelectTrigger>
                <SelectContent>
                  {proceduresList.map((procedure) => (
                    <SelectItem key={procedure} value={procedure}>
                      {procedure}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveAppointment} className="bg-blue-600 hover:bg-blue-700">
              Agendar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};