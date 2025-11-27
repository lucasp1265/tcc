import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Plus, Edit2, UserCheck, Stethoscope } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const mockProfessionals = [
  {
    id: '1',
    name: 'Dr. João Silva',
    crm: 'CRO-SP 12345',
    specialty: 'Clínica Geral',
    phone: '(11) 99999-1111',
    email: 'dr.joao@dentalcare.com',
    address: 'Rua das Clínicas, 100 - São Paulo, SP',
    experience: 15,
    status: 'ativo'
  },
  {
    id: '2',
    name: 'Dra. Ana Santos',
    crm: 'CRO-SP 67890',
    specialty: 'Endodontia',
    phone: '(11) 99999-2222',
    email: 'dra.ana@dentalcare.com',
    address: 'Av. Médica, 200 - São Paulo, SP',
    experience: 12,
    status: 'ativo'
  },
  {
    id: '3',
    name: 'Dr. Pedro Wilson',
    crm: 'CRO-SP 11223',
    specialty: 'Cirurgia Oral',
    phone: '(11) 99999-3333',
    email: 'dr.pedro@dentalcare.com',
    address: 'Rua Cirúrgica, 300 - São Paulo, SP',
    experience: 20,
    status: 'ativo'
  },
  {
    id: '4',
    name: 'Dra. Carla Brown',
    crm: 'CRO-SP 44556',
    specialty: 'Ortodontia',
    phone: '(11) 99999-4444',
    email: 'dra.carla@dentalcare.com',
    address: 'Av. Ortodôntica, 400 - São Paulo, SP',
    experience: 8,
    status: 'ativo'
  },
  {
    id: '5',
    name: 'Dr. Ricardo Martinez',
    crm: 'CRO-SP 77889',
    specialty: 'Implantodontia',
    phone: '(11) 99999-5555',
    email: 'dr.ricardo@dentalcare.com',
    address: 'Rua Implantes, 500 - São Paulo, SP',
    experience: 18,
    status: 'inativo'
  }
];

const mockSpecialties = [
  'Clínica Geral',
  'Endodontia',
  'Ortodontia',
  'Cirurgia Oral',
  'Implantodontia',
  'Dentística',
  'Periodontia',
  'Odontopediatria'
];

const realProfessionals = null;
const realSpecialties = null;

export const Professionals = () => {
  const [professionals, setProfessionals] = useState(realProfessionals || mockProfessionals);
  const specialties = realSpecialties || mockSpecialties;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProfessionals = professionals.filter(professional =>
    professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.crm.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professional.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfessionalClick = (professional) => {
    setSelectedProfessional(professional);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    if (selectedProfessional) {
      if (selectedProfessional.id === 'new') {
        const newProfessional = {
          ...selectedProfessional,
          id: Date.now().toString()
        };
        setProfessionals([...professionals, newProfessional]);
      } else {
        setProfessionals(professionals.map(p => p.id === selectedProfessional.id ? selectedProfessional : p));
      }
      setIsEditMode(false);
      setIsDialogOpen(false);
    }
  };

  const handleNewProfessional = () => {
    const newProfessional = {
      id: 'new',
      name: '',
      crm: '',
      specialty: '',
      phone: '',
      email: '',
      address: '',
      experience: 0,
      status: 'ativo'
    };
    setSelectedProfessional(newProfessional);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const getStatusColor = (status) => {
    return status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Profissionais</h2>
        <Button onClick={handleNewProfessional} className="bg-blue-600 hover:bg-blue-700 hover-lift">
          <Plus size={16} className="mr-2" />
          Novo Profissional
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Profissionais</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar profissionais..."
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
                <TableHead>Nome</TableHead>
                <TableHead>CRO</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Experiência</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfessionals.map((professional) => (
                <TableRow key={professional.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell>
                    <button
                      onClick={() => handleProfessionalClick(professional)}
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                    >
                      {professional.name}
                    </button>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{professional.crm}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Stethoscope size={14} className="mr-2 text-blue-600" />
                      {professional.specialty}
                    </div>
                  </TableCell>
                  <TableCell>{professional.experience} anos</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(professional.status)}`}>
                      {professional.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleProfessionalClick(professional)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <UserCheck size={16} className="mr-1" />
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
              {isEditMode ? (selectedProfessional?.name ? 'Editar Profissional' : 'Novo Profissional') : 'Detalhes do Profissional'}
            </DialogTitle>
          </DialogHeader>

          {selectedProfessional && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={selectedProfessional.name}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedProfessional({...selectedProfessional, name: e.target.value})}
                    placeholder="Digite o nome do profissional"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="crm">CRO</Label>
                  <Input
                    id="crm"
                    value={selectedProfessional.crm}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedProfessional({...selectedProfessional, crm: e.target.value})}
                    placeholder="CRO-SP 12345"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  {isEditMode ? (
                    <Select
                      value={selectedProfessional.specialty}
                      onValueChange={(value) => setSelectedProfessional({...selectedProfessional, specialty: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={selectedProfessional.specialty} disabled />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={selectedProfessional.phone}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedProfessional({...selectedProfessional, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={selectedProfessional.email}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedProfessional({...selectedProfessional, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Anos de Experiência</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={selectedProfessional.experience}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedProfessional({...selectedProfessional, experience: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditMode ? (
                    <Select
                      value={selectedProfessional.status}
                      onValueChange={(value) => setSelectedProfessional({...selectedProfessional, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input value={selectedProfessional.status} disabled />
                  )}
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={selectedProfessional.address}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedProfessional({...selectedProfessional, address: e.target.value})}
                    placeholder="Digite o endereço"
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
                    Editar Profissional
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