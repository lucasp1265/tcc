import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';

export const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [prosList, setProsList] = useState([]);
  const [procList, setProcList] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertInfo, setAlertInfo] = useState({ open: false, title: '', message: '' });

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'PENDING': return 'Pendente';
      case 'IN_PROGRESS': return 'Em Tratamento';
      case 'COMPLETED': return 'Concluído';
      case 'CANCELLED': return 'Cancelado';
      default: return status;
    }
  };

  const fetchBudgets = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const headers = { 'Authorization': `Bearer ${token}` };
      const apiUrl = import.meta.env.VITE_API_URL;

      const [bdgRes, patRes, proRes, procRes] = await Promise.all([
        fetch(`${apiUrl}/budgets/`, { headers }),
        fetch(`${apiUrl}/patients/`, { headers }),
        fetch(`${apiUrl}/professionals/`, { headers }),
        fetch(`${apiUrl}/procedures/`, { headers })
      ]);

      if (bdgRes.ok) {
        const data = await bdgRes.json();
        const patients = await patRes.json();
        const pros = await proRes.json();
        const procs = await procRes.json();

        setPatientsList(patients);
        setProsList(pros);
        setProcList(procs);

        const formatted = data.map(b => ({
          id: b.id,
          name: b.name,
          date: b.date,
          value: b.totalValue,
          validUntil: b.validUntil,
          status: b.status, 
          notes: b.notes,
          patientId: b.patient,
          professionalId: b.professional,
          procedureId: b.procedure,
          patientName: patients.find(p => p.id === b.patient)?.name || 'N/A',
          proName: pros.find(p => p.id === b.professional)?.name || 'N/A',
          procName: procs.find(p => p.id === b.procedure)?.name || '',
        }));
        setBudgets(formatted);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchBudgets(); }, []);

  const showAlert = (title, message) => {
    setAlertInfo({ open: true, title, message });
  };

  const handleSave = async () => {
    if (!selectedBudget.name || !selectedBudget.patientId) {
      showAlert("Campos Obrigatórios", "Informe Nome do Orçamento e Paciente.");
      return;
    }

    const token = localStorage.getItem('accessToken');
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
      ? `${import.meta.env.VITE_API_URL}/budgets/${selectedBudget.id}/`
      : `${import.meta.env.VITE_API_URL}/budgets/`;

    const payload = {
      name: selectedBudget.name,
      date: selectedBudget.date,
      totalValue: selectedBudget.value,
      validUntil: selectedBudget.validUntil,
      status: selectedBudget.status,
      notes: selectedBudget.notes,
      patient: selectedBudget.patientId,
      professional: selectedBudget.professionalId,
      procedure: selectedBudget.procedureId
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchBudgets();
        setIsDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Excluir orçamento?")) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/budgets/${selectedBudget.id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchBudgets();
        setIsDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleNew = () => {
    setSelectedBudget({ name: '', date: '', value: 0, validUntil: '', status: 'PENDING', notes: '', patientId: '', professionalId: '', procedureId: '' });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (b) => {
    setSelectedBudget(b);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const filtered = budgets.filter(b => b.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Orçamentos</h2>
        <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700"><Plus size={16} className="mr-2"/> Novo Orçamento</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista</CardTitle>
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Paciente</TableHead>
                <TableHead className="text-left">Valor</TableHead>
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(b => (
                <TableRow key={b.id}>
                  <TableCell className="text-left">{b.patientName}</TableCell>
                  <TableCell className="text-left">R$ {Number(b.value).toFixed(2)}</TableCell>
                  <TableCell className="text-left">
                    <Badge className={getStatusColor(b.status)}>
                      {translateStatus(b.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(b)}><Edit2 size={16}/></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{isEditMode ? 'Editar' : 'Novo Orçamento'}</DialogTitle></DialogHeader>
          {selectedBudget && (
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left"><Label>Nome/Título *</Label><Input value={selectedBudget.name} onChange={(e) => setSelectedBudget({...selectedBudget, name: e.target.value})} /></div>
                <div className="space-y-2 text-left"><Label>Data</Label><Input type="date" value={selectedBudget.date} onChange={(e) => setSelectedBudget({...selectedBudget, date: e.target.value})} /></div>
                <div className="space-y-2 text-left"><Label>Paciente *</Label>
                  <Select value={String(selectedBudget.patientId)} onValueChange={(v) => setSelectedBudget({...selectedBudget, patientId: v})}>
                    <SelectTrigger><span>{patientsList.find(p => String(p.id) === String(selectedBudget.patientId))?.name || "Selecione"}</span></SelectTrigger>
                    <SelectContent>{patientsList.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left"><Label>Profissional</Label>
                  <Select value={String(selectedBudget.professionalId)} onValueChange={(v) => setSelectedBudget({...selectedBudget, professionalId: v})}>
                    <SelectTrigger><span>{prosList.find(p => String(p.id) === String(selectedBudget.professionalId))?.name || "Selecione"}</span></SelectTrigger>
                    <SelectContent>{prosList.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left"><Label>Procedimento</Label>
                  <Select value={String(selectedBudget.procedureId)} onValueChange={(v) => setSelectedBudget({...selectedBudget, procedureId: v})}>
                    <SelectTrigger><span>{procList.find(p => String(p.id) === String(selectedBudget.procedureId))?.name || "Selecione"}</span></SelectTrigger>
                    <SelectContent>{procList.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left"><Label>Valor Total</Label><Input type="number" step="0.01" value={selectedBudget.value} onChange={(e) => setSelectedBudget({...selectedBudget, value: e.target.value})} /></div>
                <div className="space-y-2 text-left"><Label>Válido Até</Label><Input type="date" value={selectedBudget.validUntil} onChange={(e) => setSelectedBudget({...selectedBudget, validUntil: e.target.value})} /></div>
                <div className="space-y-2 text-left"><Label>Status</Label>
                  <Select value={selectedBudget.status} onValueChange={(v) => setSelectedBudget({...selectedBudget, status: v})}>
                    <SelectTrigger><span>{translateStatus(selectedBudget.status)}</span></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="IN_PROGRESS">Em Tratamento</SelectItem>
                      <SelectItem value="COMPLETED">Concluído</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2 text-left"><Label>Notas</Label><Textarea value={selectedBudget.notes} onChange={(e) => setSelectedBudget({...selectedBudget, notes: e.target.value})} /></div>
              </div>
              <div className="flex justify-between mt-4">
                <div>{isEditMode && <Button variant="destructive" onClick={handleDelete}><Trash2 size={16} className="mr-2"/> Excluir</Button>}</div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">Salvar</Button>
                </div>
              </div>
            </div>
          )}
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