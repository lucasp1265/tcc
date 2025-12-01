import React, { useState, useEffect } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Clock, Plus, Trash2, Edit2, CalendarCheck, AlertCircle } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

export const Scheduling = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [prosList, setProsList] = useState([]);
  const [procList, setProcList] = useState([]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, title: '', message: '' });

  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = import.meta.env.VITE_API_URL;

      const [schedRes, patRes, proRes, procRes] = await Promise.all([
        fetch(`${apiUrl}/schedules/`, { headers }),
        fetch(`${apiUrl}/patients/`, { headers }),
        fetch(`${apiUrl}/professionals/`, { headers }),
        fetch(`${apiUrl}/procedures/`, { headers })
      ]);

      if (schedRes.ok) {
        const schedules = await schedRes.json();
        const patients = await patRes.json();
        const pros = await proRes.json();
        const procs = await procRes.json();

        setPatientsList(patients);
        setProsList(pros);
        setProcList(procs);

        const formatted = schedules.map(s => ({
          id: s.id,
          date: s.date,
          time: s.time.substring(0, 5),
          patientId: s.patient,
          professionalId: s.professional,
          procedureId: s.procedure,
          patientName: patients.find(p => p.id === s.patient)?.name || 'Desconhecido',
          proName: pros.find(p => p.id === s.professional)?.name || 'Desconhecido',
          procName: procs.find(p => p.id === s.procedure)?.name || '-',
        }));
        setAppointments(formatted);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchData(); }, []);

  const showAlert = (title, message) => {
    setAlertInfo({ open: true, title, message });
  };

  const handleSave = async () => {
    if (!currentAppointment.date || !currentAppointment.time || !currentAppointment.patientId) {
      showAlert("Campos Obrigatórios", "Selecione Data, Horário e Paciente.");
      return;
    }

    const token = localStorage.getItem('accessToken');
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
      ? `${import.meta.env.VITE_API_URL}/schedules/${currentAppointment.id}/`
      : `${import.meta.env.VITE_API_URL}/schedules/`;

    const payload = {
      date: currentAppointment.date,
      time: currentAppointment.time,
      patient: currentAppointment.patientId,
      professional: currentAppointment.professionalId,
      procedure: currentAppointment.procedureId
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchData();
        setIsDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Cancelar este agendamento?")) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/schedules/${currentAppointment.id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchData();
        setIsDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleNew = () => {
    setCurrentAppointment({ 
      date: selectedDate.toISOString().split('T')[0], 
      time: timeSlots[0], patientId: '', professionalId: '', procedureId: '' 
    });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (apt) => {
    setCurrentAppointment(apt);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const dayAppointments = appointments.filter(a => a.date === selectedDate.toISOString().split('T')[0]);
  
  // Cálculo de estatísticas do dia
  const totalSlots = timeSlots.length;
  const occupiedSlots = dayAppointments.length;
  const availableSlots = totalSlots - occupiedSlots;
  const occupancyRate = Math.round((occupiedSlots / totalSlots) * 100);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Agendamentos</h2>
        <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" /> Novo Agendamento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Calendário */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle>Calendário</CardTitle></CardHeader>
            <CardContent>
              <Calendar mode="single" selected={selectedDate} onSelect={(date) => date && setSelectedDate(date)} locale={ptBR} className="rounded-md border mx-auto" />
            </CardContent>
          </Card>
        </div>

        {/* Coluna Direita: Resumo + Lista */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card de Resumo do Dia */}
          <Card className="bg-white border-blue-100 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <CalendarCheck size={18} className="mr-2 text-blue-600"/> 
                  Resumo: {selectedDate.toLocaleDateString('pt-BR')}
                </h3>
                <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {occupancyRate}% Ocupado
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center border">
                  <span className="block text-2xl font-bold text-gray-800">{occupiedSlots}</span>
                  <span className="text-xs text-gray-500 uppercase">Agendados</span>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center border border-green-100">
                  <span className="block text-2xl font-bold text-green-600">{availableSlots}</span>
                  <span className="text-xs text-gray-500 uppercase">Vagas Livres</span>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center border border-purple-100">
                  <span className="block text-2xl font-bold text-purple-600">{totalSlots}</span>
                  <span className="text-xs text-gray-500 uppercase">Capacidade</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-full min-h-[400px]">
            <CardHeader><CardTitle>Horários</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {dayAppointments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <AlertCircle size={48} className="mb-2 opacity-20"/>
                    <p>Dia livre. Nenhum agendamento.</p>
                  </div>
                ) : (
                  dayAppointments.sort((a,b) => a.time.localeCompare(b.time)).map(apt => (
                    <div key={apt.id} className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors border-l-4 border-l-blue-500 bg-white">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-50 rounded-full"><Clock size={20} className="text-blue-600"/></div>
                        <div>
                          <p className="font-bold text-lg text-gray-800">{apt.time}</p>
                          <p className="font-medium">{apt.patientName}</p>
                          <p className="text-xs text-gray-500">{apt.procName} com {apt.proName}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(apt)}><Edit2 size={16} className="text-gray-500"/></Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{isEditMode ? 'Editar' : 'Novo'}</DialogTitle></DialogHeader>
          <div className="space-y-4 text-left">
            <div className="space-y-2 text-left"><Label>Data *</Label><Input type="date" value={currentAppointment.date} onChange={(e) => setCurrentAppointment({...currentAppointment, date: e.target.value})} /></div>
            <div className="space-y-2 text-left"><Label>Horário *</Label>
              <Select value={currentAppointment.time} onValueChange={(v) => setCurrentAppointment({...currentAppointment, time: v})}>
                <SelectTrigger><span>{currentAppointment.time || "Selecione"}</span></SelectTrigger>
                <SelectContent>{timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-left"><Label>Paciente *</Label>
              <Select value={String(currentAppointment.patientId)} onValueChange={(v) => setCurrentAppointment({...currentAppointment, patientId: v})}>
                <SelectTrigger><span>{patientsList.find(p => String(p.id) === String(currentAppointment.patientId))?.name || "Selecione"}</span></SelectTrigger>
                <SelectContent>{patientsList.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-left"><Label>Profissional</Label>
              <Select value={String(currentAppointment.professionalId)} onValueChange={(v) => setCurrentAppointment({...currentAppointment, professionalId: v})}>
                <SelectTrigger><span>{prosList.find(p => String(p.id) === String(currentAppointment.professionalId))?.name || "Selecione"}</span></SelectTrigger>
                <SelectContent>{prosList.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 text-left"><Label>Procedimento</Label>
              <Select value={String(currentAppointment.procedureId)} onValueChange={(v) => setCurrentAppointment({...currentAppointment, procedureId: v})}>
                <SelectTrigger><span>{procList.find(p => String(p.id) === String(currentAppointment.procedureId))?.name || "Selecione"}</span></SelectTrigger>
                <SelectContent>{procList.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <div>{isEditMode && <Button variant="destructive" onClick={handleDelete}><Trash2 size={16} className="mr-2"/> Excluir</Button>}</div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={alertInfo.open} onOpenChange={(open) => setAlertInfo({ ...alertInfo, open })}>
        <DialogContent className="max-w-sm text-center">
          <DialogHeader><DialogTitle className="text-center text-red-600">{alertInfo.title}</DialogTitle></DialogHeader>
          <div className="py-4"><p className="text-gray-700">{alertInfo.message}</p></div>
          <div className="flex justify-center"><Button onClick={() => setAlertInfo({ ...alertInfo, open: false })}>Entendido</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
};