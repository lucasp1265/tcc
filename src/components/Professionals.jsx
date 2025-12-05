import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Plus, Edit2, UserCheck, Stethoscope, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';

export const Professionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ open: false, title: '', message: '' });

  const specialties = ['Clínica Geral', 'Endodontia', 'Ortodontia', 'Cirurgia Oral', 'Implantodontia', 'Dentística'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'VACATION': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo';
      case 'INACTIVE': return 'Inativo';
      case 'VACATION': return 'Férias';
      default: return status;
    }
  };

  const fetchPros = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/professionals/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const formatted = data.map(p => ({
          id: p.id,
          name: p.name,
          phone: p.phone,
          email: p.email,
          crm: p.cro,
          specialty: p.specialty,
          address: p.address,
          experience: p.yearsExperience,
          status: p.status
        }));
        setProfessionals(formatted);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchPros(); }, []);

  const showAlert = (title, message) => {
    setAlertInfo({ open: true, title, message });
  };

  const handleSave = async () => {
    if (!selectedProfessional.name || !selectedProfessional.crm || !selectedProfessional.phone) {
      showAlert("Campos Obrigatórios", "Preencha Nome, CRO e Telefone.");
      return;
    }

    const token = localStorage.getItem('accessToken');
    const method = isEditMode ? 'PUT' : 'POST';
    const url = isEditMode 
      ? `${import.meta.env.VITE_API_URL}/professionals/${selectedProfessional.id}/`
      : `${import.meta.env.VITE_API_URL}/professionals/`;

    const payload = {
      name: selectedProfessional.name,
      phone: selectedProfessional.phone,
      email: selectedProfessional.email,
      cro: selectedProfessional.crm,
      specialty: selectedProfessional.specialty,
      address: selectedProfessional.address,
      yearsExperience: selectedProfessional.experience,
      status: selectedProfessional.status
    };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        fetchPros();
        setIsDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleDelete = async () => {
    if (!window.confirm("Deseja excluir este profissional?")) return;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/professionals/${selectedProfessional.id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchPros();
        setIsDialogOpen(false);
      }
    } catch (error) { console.error(error); }
  };

  const handleNew = () => {
    setSelectedProfessional({ name: '', crm: '', specialty: specialties[0], phone: '', email: '', address: '', experience: 0, status: 'ACTIVE' });
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (pro) => {
    setSelectedProfessional(pro);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const filtered = professionals.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Profissionais</h2>
        <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" /> Novo Profissional
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Profissionais</CardTitle>
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
                <TableHead className="text-left">CRO</TableHead>
                <TableHead className="text-left">Especialidade</TableHead>
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-left">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((pro) => (
                <TableRow key={pro.id}>
                  <TableCell className="text-left">{pro.name}</TableCell>
                  <TableCell className="text-left">{pro.crm}</TableCell>
                  <TableCell className="text-left">{pro.specialty}</TableCell>
                  <TableCell className="text-left">
                    <Badge className={getStatusColor(pro.status)}>
                      {translateStatus(pro.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-left">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(pro)}>
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
          <DialogHeader><DialogTitle>{isEditMode ? 'Editar' : 'Novo'}</DialogTitle></DialogHeader>
          {selectedProfessional && (
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 text-left">
                  <Label>Nome *</Label>
                  <Input value={selectedProfessional.name} onChange={(e) => setSelectedProfessional({...selectedProfessional, name: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>CRO *</Label>
                  <Input value={selectedProfessional.crm} onChange={(e) => setSelectedProfessional({...selectedProfessional, crm: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Especialidade</Label>
                  <Select value={selectedProfessional.specialty} onValueChange={(v) => setSelectedProfessional({...selectedProfessional, specialty: v})}>
                    <SelectTrigger><span>{selectedProfessional.specialty || "Selecione"}</span></SelectTrigger>
                    <SelectContent>{specialties.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 text-left">
                  <Label>Telefone *</Label>
                  <Input value={selectedProfessional.phone} onChange={(e) => setSelectedProfessional({...selectedProfessional, phone: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Email</Label>
                  <Input value={selectedProfessional.email} onChange={(e) => setSelectedProfessional({...selectedProfessional, email: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Experiência (Anos)</Label>
                  <Input type="number" value={selectedProfessional.experience} onChange={(e) => setSelectedProfessional({...selectedProfessional, experience: e.target.value})} />
                </div>
                <div className="space-y-2 text-left">
                  <Label>Status</Label>
                  <Select value={selectedProfessional.status} onValueChange={(v) => setSelectedProfessional({...selectedProfessional, status: v})}>
                    <SelectTrigger><span>{translateStatus(selectedProfessional.status)}</span></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Ativo</SelectItem>
                      <SelectItem value="INACTIVE">Inativo</SelectItem>
                      <SelectItem value="VACATION">Férias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2 text-left">
                  <Label>Endereço</Label>
                  <Input value={selectedProfessional.address} onChange={(e) => setSelectedProfessional({...selectedProfessional, address: e.target.value})} />
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