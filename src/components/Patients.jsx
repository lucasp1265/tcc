import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Plus, Edit2, User } from 'lucide-react';

const mockPatients = [
  {
    id: '1',
    fileNumber: 'P001',
    name: 'Maria Silva',
    phone: '(11) 99999-9999',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    dateOfBirth: '1985-03-15',
    medicalHistory: 'Sem alergias conhecidas. Tratamento de canal anterior em 2022.',
    email: 'maria.silva@email.com'
  },
  {
    id: '2',
    fileNumber: 'P002',
    name: 'João Santos',
    phone: '(11) 88888-8888',
    address: 'Av. Paulista, 456 - São Paulo, SP',
    dateOfBirth: '1978-07-22',
    medicalHistory: 'Diabetes tipo 2. Limpeza regular a cada 6 meses.',
    email: 'joao.santos@email.com'
  },
  {
    id: '3',
    fileNumber: 'P003',
    name: 'Ana Costa',
    phone: '(11) 77777-7777',
    address: 'Rua da Consolação, 789 - São Paulo, SP',
    dateOfBirth: '1992-11-08',
    medicalHistory: 'Tratamento ortodôntico concluído em 2020. Sem alergias.',
    email: 'ana.costa@email.com'
  },
  {
    id: '4',
    fileNumber: 'P004',
    name: 'Carlos Lima',
    phone: '(11) 66666-6666',
    address: 'Rua Augusta, 321 - São Paulo, SP',
    dateOfBirth: '1965-12-03',
    medicalHistory: 'Hipertensão arterial. Toma medicação. Implante anterior em 2019.',
    email: 'carlos.lima@email.com'
  },
  {
    id: '5',
    fileNumber: 'P005',
    name: 'Lúcia Oliveira',
    phone: '(11) 55555-5555',
    address: 'Rua Oscar Freire, 654 - São Paulo, SP',
    dateOfBirth: '1990-05-17',
    medicalHistory: 'Gestante (segundo trimestre). Sem radiografias dentárias.',
    email: 'lucia.oliveira@email.com'
  }
];

const realPatients = null;

export const Patients = () => {
  const [patients, setPatients] = useState(realPatients || mockPatients);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.fileNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (selectedPatient) {
      setPatients(patients.map(p => p.id === selectedPatient.id ? selectedPatient : p));
      setIsEditMode(false);
    }
  };

  const handleNewPatient = () => {
    const newPatient = {
      id: Date.now().toString(),
      fileNumber: `P${String(patients.length + 1).padStart(3, '0')}`,
      name: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      medicalHistory: '',
      email: ''
    };
    setSelectedPatient(newPatient);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Pacientes</h2>
        <Button onClick={handleNewPatient} className="bg-blue-600 hover:bg-blue-700 hover-lift">
          <Plus size={16} className="mr-2" />
          Novo Paciente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar pacientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número do Arquivo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell className="font-medium">{patient.fileNumber}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handlePatientClick(patient)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {patient.name}
                    </button>
                  </TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePatientClick(patient)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <User size={16} className="mr-1" />
                      Ver
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
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? (selectedPatient?.name ? 'Editar Paciente' : 'Novo Paciente') : 'Detalhes do Paciente'}
            </DialogTitle>
          </DialogHeader>

          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fileNumber">Número do Arquivo</Label>
                  <Input
                    id="fileNumber"
                    value={selectedPatient.fileNumber}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedPatient({...selectedPatient, fileNumber: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={selectedPatient.name}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedPatient({...selectedPatient, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={selectedPatient.phone}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedPatient({...selectedPatient, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    value={selectedPatient.email}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedPatient({...selectedPatient, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={selectedPatient.dateOfBirth}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedPatient({...selectedPatient, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={selectedPatient.address}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedPatient({...selectedPatient, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="medicalHistory">Histórico Médico</Label>
                  <Textarea
                    id="medicalHistory"
                    value={selectedPatient.medicalHistory}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedPatient({...selectedPatient, medicalHistory: e.target.value})}
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                {isEditMode ? (
                  <>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      Salvar Alterações
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                    <Edit2 size={16} className="mr-2" />
                    Editar Paciente
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};