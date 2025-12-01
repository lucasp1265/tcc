import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const Procedures = () => {
  const [procedures, setProcedures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, title: '', message: '' });

  const specialties = ['Clínica Geral', 'Endodontia', 'Ortodontia', 'Cirurgia Oral', 'Implantodontia', 'Dentística', 'Periodontia', 'Odontopediatria'];

  const fetchProcedures = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/procedures/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map(proc => ({
          id: proc.id,
          name: proc.name,
          value: proc.price,
          duration: proc.durationMinutes,
          specialty: proc.specialty,
          description: proc.description
        }));
        setProcedures(formatted);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchProcedures(); }, []);

  const showAlert = (title, message) => {
    setAlertInfo({ open: true, title, message });
  };

  const handleSave = async () => {
    if (!selectedProcedure.name || !selectedProcedure.value || !selectedProcedure.specialty) {
      showAlert("Atenção", "Preencha Nome, Valor e Especialidade.");
      return;
    }

    const token = localStorage.getItem('accessToken');
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
      ? `${import.meta.env.VITE_API_URL}/procedures/${selectedProcedure.id}/`
      : `${import.meta.env.VITE_API_URL}/procedures/`;

    const payload = {
      name: selectedProcedure.name,
      price: selectedProcedure.value,
      durationMinutes: selectedProcedure.duration,
      specialty: selectedProcedure.specialty,
      description: selectedProcedure.description
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchProcedures();
        setIsDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Deseja excluir este procedimento?")) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/procedures/${selectedProcedure.id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchProcedures();
        setIsDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleNewProcedure = () => {
    setSelectedProcedure({ name: '', value: 0, specialty: specialties[0], description: '', duration: 0 });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (procedure) => {
    setSelectedProcedure(procedure);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const filteredProcedures = procedures.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Procedimentos</h2>
        <Button onClick={handleNewProcedure} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" /> Novo Procedimento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Procedimentos</CardTitle>
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Nome</TableHead>
                <TableHead className="text-left">Valor</TableHead>
                <TableHead className="text-left">Especialidade</TableHead>
                <TableHead className="text-left">Duração</TableHead>
                <TableHead className="text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcedures.map((proc) => (
                <TableRow key={proc.id}>
                  <TableCell className="text-left">{proc.name}</TableCell>
                  <TableCell className="text-left">R$ {Number(proc.value).toFixed(2)}</TableCell>
                  <TableCell className="text-left">{proc.specialty}</TableCell>
                  <TableCell className="text-left">{proc.duration} min</TableCell>
                  <TableCell className="text-left">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(proc)}>
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
          <DialogHeader><DialogTitle>{isEditMode ? 'Editar Procedimento' : 'Novo Procedimento'}</DialogTitle></DialogHeader>
          {selectedProcedure && (
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2 text-left">
                  <Label>Nome *</Label>
                  <Input value={selectedProcedure.name} onChange={(e) => setSelectedProcedure({...selectedProcedure, name: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Valor (R$) *</Label>
                  <Input type="number" step="0.01" value={selectedProcedure.value} onChange={(e) => setSelectedProcedure({...selectedProcedure, value: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Duração (min)</Label>
                  <Input type="number" value={selectedProcedure.duration} onChange={(e) => setSelectedProcedure({...selectedProcedure, duration: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2 text-left">
                  <Label>Especialidade *</Label>
                  <Select value={selectedProcedure.specialty} onValueChange={(value) => setSelectedProcedure({...selectedProcedure, specialty: value})}>
                    <SelectTrigger><span>{selectedProcedure.specialty || "Selecione"}</span></SelectTrigger>
                    <SelectContent>{specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2 text-left">
                  <Label>Descrição</Label>
                  <Input value={selectedProcedure.description} onChange={(e) => setSelectedProcedure({...selectedProcedure, description: e.target.value})} />
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