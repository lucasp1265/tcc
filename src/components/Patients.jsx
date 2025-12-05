import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Plus, Edit2, User, Trash2 } from 'lucide-react';

export const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, title: '', message: '' });

  const formatPhone = (value) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.substring(0, 11);
    let formatted = limited;
    if (limited.length > 2) formatted = `(${limited.substring(0, 2)}) ${limited.substring(2)}`;
    if (limited.length > 7) formatted = `(${limited.substring(0, 2)}) ${limited.substring(2, 7)}-${limited.substring(7)}`;
    return formatted;
  };

  const formatCPF = (value) => {
    if (!value) return "";
    const numbers = value.replace(/\D/g, "");
    const limited = numbers.substring(0, 11);
    return limited.replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/patients/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map(p => ({
          id: p.id,
          fileNumber: `P${String(p.id).padStart(3, '0')}`,
          name: p.name,
          cpf: formatCPF(p.cpf || ''), 
          phone: p.phone,
          email: p.email,
          address: p.address,
          dateOfBirth: p.birthDate,
          medicalHistory: p.medicalHistory
        }));
        setPatients(formatted);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchPatients(); }, []);

  const showAlert = (title, message) => {
    setAlertInfo({ open: true, title, message });
  };

  const handleSave = async () => {
    if (!selectedPatient.name || !selectedPatient.phone || !selectedPatient.email || !selectedPatient.cpf) {
      showAlert("Atenção", "Preencha Nome, CPF, Telefone e Email.");
      return;
    }

    const token = localStorage.getItem('accessToken');
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
      ? `${import.meta.env.VITE_API_URL}/patients/${selectedPatient.id}/`
      : `${import.meta.env.VITE_API_URL}/patients/`;

    const cleanCPF = selectedPatient.cpf.replace(/\D/g, "");
    const payload = {
      name: selectedPatient.name,
      cpf: cleanCPF,
      phone: selectedPatient.phone,
      email: selectedPatient.email,
      birthDate: selectedPatient.dateOfBirth,
      address: selectedPatient.address,
      medicalHistory: selectedPatient.medicalHistory
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        fetchPatients();
        setIsDialogOpen(false);
      } else {
        const errorData = await response.json();
        showAlert("Erro", errorData.cpf ? "CPF já cadastrado." : "Erro ao salvar.");
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Tem certeza que deseja excluir este paciente?")) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/patients/${selectedPatient.id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchPatients();
        setIsDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleNewPatient = () => {
    setSelectedPatient({ name: '', cpf: '', phone: '', email: '', dateOfBirth: '', address: '', medicalHistory: '' });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEditClick = (patient) => {
    setSelectedPatient(patient);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.cpf && p.cpf.includes(searchTerm))
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Pacientes</h2>
        <Button onClick={handleNewPatient} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" /> Novo Paciente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Buscar por nome ou CPF..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Número</TableHead>
                <TableHead className="text-left">Nome</TableHead>
                <TableHead className="text-left">CPF</TableHead>
                <TableHead className="text-left">Telefone</TableHead>
                <TableHead className="text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-gray-50">
                  <TableCell className="text-left font-medium">{patient.fileNumber}</TableCell>
                  <TableCell className="text-left">{patient.name}</TableCell>
                  <TableCell className="text-left">{patient.cpf}</TableCell>
                  <TableCell className="text-left">{patient.phone}</TableCell>
                  <TableCell className="text-left">
                    <Button variant="ghost" size="sm" onClick={() => handleEditClick(patient)}>
                      <Edit2 size={16} className="mr-1" /> Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{isEditMode ? 'Editar Paciente' : 'Novo Paciente'}</DialogTitle></DialogHeader>
          {selectedPatient && (
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label>Nome Completo *</Label>
                  <Input value={selectedPatient.name} onChange={(e) => setSelectedPatient({...selectedPatient, name: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>CPF *</Label>
                  <Input value={selectedPatient.cpf} onChange={(e) => setSelectedPatient({...selectedPatient, cpf: formatCPF(e.target.value)})} maxLength={14} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Telefone *</Label>
                  <Input type="tel" value={selectedPatient.phone} onChange={(e) => setSelectedPatient({...selectedPatient, phone: formatPhone(e.target.value)})} maxLength={15} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>E-mail *</Label>
                  <Input value={selectedPatient.email} onChange={(e) => setSelectedPatient({...selectedPatient, email: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Data de Nascimento</Label>
                  <Input type="date" value={selectedPatient.dateOfBirth} onChange={(e) => setSelectedPatient({...selectedPatient, dateOfBirth: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2 text-left">
                  <Label>Endereço</Label>
                  <Input value={selectedPatient.address} onChange={(e) => setSelectedPatient({...selectedPatient, address: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2 text-left">
                  <Label>Histórico Médico</Label>
                  <Textarea value={selectedPatient.medicalHistory} onChange={(e) => setSelectedPatient({...selectedPatient, medicalHistory: e.target.value})} />
                </div>
              </div>
              <div className="flex justify-between space-x-2">
                <div>{isEditMode && <Button variant="destructive" onClick={handleDelete}><Trash2 size={16} className="mr-2" /> Excluir</Button>}</div>
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