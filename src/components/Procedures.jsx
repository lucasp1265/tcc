import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Plus, Edit2, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const mockProcedures = [
  {
    id: '1',
    name: 'Limpeza Dental',
    value: 150.00,
    specialty: 'Clínica Geral',
    description: 'Limpeza profissional e remoção de placa bacteriana',
    duration: 60
  },
  {
    id: '2',
    name: 'Tratamento de Canal',
    value: 800.00,
    specialty: 'Endodontia',
    description: 'Terapia endodôntica completa para dente infectado',
    duration: 120
  },
  {
    id: '3',
    name: 'Extração Dental',
    value: 200.00,
    specialty: 'Cirurgia Oral',
    description: 'Procedimento de extração dentária simples',
    duration: 30
  },
  {
    id: '4',
    name: 'Implante Dentário',
    value: 2500.00,
    specialty: 'Implantodontia',
    description: 'Colocação de implante unitário',
    duration: 180
  },
  {
    id: '5',
    name: 'Consulta Ortodôntica',
    value: 100.00,
    specialty: 'Ortodontia',
    description: 'Avaliação ortodôntica inicial e planejamento de tratamento',
    duration: 45
  },
  {
    id: '6',
    name: 'Clareamento Dental',
    value: 400.00,
    specialty: 'Dentística',
    description: 'Clareamento dental profissional em consultório',
    duration: 90
  }
];

const specialties = [
  'Clínica Geral',
  'Endodontia',
  'Ortodontia',
  'Cirurgia Oral',
  'Implantodontia',
  'Dentística',
  'Periodontia',
  'Odontopediatria'
];

const realProcedures = null;
const realSpecialties = null;

export const Procedures = () => {
  const [procedures, setProcedures] = useState(realProcedures || mockProcedures);
  const specialtiesList = realSpecialties || specialties;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredProcedures = procedures.filter(procedure =>
    procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    procedure.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (procedure) => {
    setSelectedProcedure(procedure);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedProcedure) {
      if (selectedProcedure.id === 'new') {
        const newProcedure = {
          ...selectedProcedure,
          id: Date.now().toString()
        };
        setProcedures([...procedures, newProcedure]);
      } else {
        setProcedures(procedures.map(p => p.id === selectedProcedure.id ? selectedProcedure : p));
      }
      setIsEditMode(false);
      setIsDialogOpen(false);
    }
  };

  const handleNewProcedure = () => {
    const newProcedure = {
      id: 'new',
      name: '',
      value: 0,
      specialty: '',
      description: '',
      duration: 0
    };
    setSelectedProcedure(newProcedure);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Procedimentos</h2>
        <Button onClick={handleNewProcedure} className="bg-blue-600 hover:bg-blue-700 hover-lift">
          <Plus size={16} className="mr-2" />
          Novo Procedimento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Procedimentos</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar procedimentos..."
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
                <TableHead>Nome do Procedimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProcedures.map((procedure) => (
                <TableRow key={procedure.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{procedure.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1 text-green-600" />
                      {formatCurrency(procedure.value)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {procedure.specialty}
                    </span>
                  </TableCell>
                  <TableCell>{procedure.duration} min</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(procedure)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit2 size={16} className="mr-1" />
                      Editar
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
              {selectedProcedure?.id === 'new' ? 'Novo Procedimento' : 'Editar Procedimento'}
            </DialogTitle>
          </DialogHeader>

          {selectedProcedure && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nome do Procedimento</Label>
                  <Input
                    id="name"
                    value={selectedProcedure.name}
                    onChange={(e) => setSelectedProcedure({...selectedProcedure, name: e.target.value})}
                    placeholder="Digite o nome do procedimento"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value">Valor (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={selectedProcedure.value}
                    onChange={(e) => setSelectedProcedure({...selectedProcedure, value: parseFloat(e.target.value) || 0})}
                    placeholder="0,00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (minutos)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={selectedProcedure.duration}
                    onChange={(e) => setSelectedProcedure({...selectedProcedure, duration: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Select
                    value={selectedProcedure.specialty}
                    onValueChange={(value) => setSelectedProcedure({...selectedProcedure, specialty: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialtiesList.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={selectedProcedure.description}
                    onChange={(e) => setSelectedProcedure({...selectedProcedure, description: e.target.value})}
                    placeholder="Digite a descrição do procedimento"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                  Salvar Procedimento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};