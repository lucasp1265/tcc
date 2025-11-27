import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Search, Plus, Eye, DollarSign, FileText, Calendar, Clock, Edit2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';

const mockBudgets = [
  {
    id: '1',
    budgetNumber: 'ORC-001',
    patient: 'Maria Silva',
    professional: 'Dr. João',
    value: 2500.00,
    date: '2024-12-20',
    status: 'aprovado',
    procedures: ['Limpeza Dental', 'Canal'],
    notes: 'Paciente aprovou o plano de tratamento. Agendado para próxima semana.',
    validUntil: '2025-01-20'
  },
  {
    id: '2',
    budgetNumber: 'ORC-002',
    patient: 'João Santos',
    professional: 'Dra. Ana',
    value: 4500.00,
    date: '2024-12-18',
    status: 'pendente',
    procedures: ['Implante Dentário', 'Coroa'],
    notes: 'Aguardando aprovação do convênio.',
    validUntil: '2025-01-18'
  },
  {
    id: '3',
    budgetNumber: 'ORC-003',
    patient: 'Ana Costa',
    professional: 'Dra. Carla',
    value: 3200.00,
    date: '2024-12-15',
    status: 'concluido',
    procedures: ['Tratamento Ortodôntico'],
    notes: 'Tratamento concluído com sucesso.',
    validUntil: '2025-01-15'
  },
  {
    id: '4',
    budgetNumber: 'ORC-004',
    patient: 'Carlos Lima',
    professional: 'Dr. Pedro',
    value: 800.00,
    date: '2024-12-22',
    status: 'rejeitado',
    procedures: ['Extração Dentária'],
    notes: 'Paciente decidiu adiar o tratamento.',
    validUntil: '2025-01-22'
  },
  {
    id: '5',
    budgetNumber: 'ORC-005',
    patient: 'Lúcia Oliveira',
    professional: 'Dr. João',
    value: 1200.00,
    date: '2024-12-23',
    status: 'pendente',
    procedures: ['Clareamento', 'Limpeza'],
    notes: 'Consulta para tratamento estético.',
    validUntil: '2025-01-23'
  }
];

const mockPatients = ['Maria Silva', 'João Santos', 'Ana Costa', 'Carlos Lima', 'Lúcia Oliveira'];
const mockProfessionals = ['Dr. João', 'Dra. Ana', 'Dr. Pedro', 'Dra. Carla'];

const realBudgets = null;
const realPatients = null;
const realProfessionals = null;

export const Budgets = () => {
  const [budgets, setBudgets] = useState(realBudgets || mockBudgets);
  const patientsList = realPatients || mockPatients;
  const professionalsList = realProfessionals || mockProfessionals;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredBudgets = budgets.filter(budget =>
    budget.budgetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    budget.professional.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'concluido':
        return 'bg-blue-100 text-blue-800';
      case 'rejeitado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleBudgetClick = (budget) => {
    setSelectedBudget(budget);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleNewBudget = () => {
    const newBudget = {
      id: 'new',
      budgetNumber: `ORC-${String(budgets.length + 1).padStart(3, '0')}`,
      patient: '',
      professional: '',
      value: 0,
      date: new Date().toISOString().split('T')[0],
      status: 'pendente',
      procedures: [],
      notes: '',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    setSelectedBudget(newBudget);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedBudget) {
      if (selectedBudget.id === 'new') {
        const newBudget = {
          ...selectedBudget,
          id: Date.now().toString()
        };
        setBudgets([...budgets, newBudget]);
      } else {
        setBudgets(budgets.map(b => b.id === selectedBudget.id ? selectedBudget : b));
      }
      setIsEditMode(false);
      setIsDialogOpen(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Orçamentos</h2>
        <Button onClick={handleNewBudget} className="bg-blue-600 hover:bg-blue-700 hover-lift">
          <Plus size={16} className="mr-2" />
          Novo Orçamento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Orçamentos</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar orçamentos..."
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
                <TableHead>Número</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBudgets.map((budget) => (
                <TableRow key={budget.id} className="hover:bg-gray-50 cursor-pointer">
                  <TableCell className="font-mono">{budget.budgetNumber}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleBudgetClick(budget)}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {budget.patient}
                    </button>
                  </TableCell>
                  <TableCell>{budget.professional}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <DollarSign size={14} className="mr-1 text-green-600" />
                      {formatCurrency(budget.value)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1 text-gray-500" />
                      {new Date(budget.date).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(budget.status)}>
                      {budget.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBudgetClick(budget)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Eye size={16} className="mr-1" />
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Orçamentos</p>
                <p className="text-2xl font-bold text-gray-900">{budgets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {budgets.filter(b => b.status === 'pendente').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Valor Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(budgets.reduce((sum, budget) => sum + budget.value, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Aprovados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {budgets.filter(b => b.status === 'aprovado').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? (selectedBudget?.budgetNumber ? 'Editar Orçamento' : 'Novo Orçamento') : 'Detalhes do Orçamento'}
            </DialogTitle>
          </DialogHeader>

          {selectedBudget && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budgetNumber">Número do Orçamento</Label>
                  <Input
                    id="budgetNumber"
                    value={selectedBudget.budgetNumber}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedBudget({...selectedBudget, budgetNumber: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedBudget.date}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedBudget({...selectedBudget, date: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient">Paciente</Label>
                  {isEditMode ? (
                    <Select
                      value={selectedBudget.patient}
                      onValueChange={(value) => setSelectedBudget({...selectedBudget, patient: value})}
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
                  ) : (
                    <Input value={selectedBudget.patient} disabled />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="professional">Profissional</Label>
                  {isEditMode ? (
                    <Select
                      value={selectedBudget.professional}
                      onValueChange={(value) => setSelectedBudget({...selectedBudget, professional: value})}
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
                  ) : (
                    <Input value={selectedBudget.professional} disabled />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="value">Valor Total (R$)</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={selectedBudget.value}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedBudget({...selectedBudget, value: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Válido até</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={selectedBudget.validUntil}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedBudget({...selectedBudget, validUntil: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  {isEditMode ? (
                    <Select
                      value={selectedBudget.status}
                      onValueChange={(value) => setSelectedBudget({...selectedBudget, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="aprovado">Aprovado</SelectItem>
                        <SelectItem value="rejeitado">Rejeitado</SelectItem>
                        <SelectItem value="concluido">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div>
                      <Badge className={getStatusColor(selectedBudget.status)}>
                        {selectedBudget.status}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label>Procedimentos</Label>
                  <div className="flex flex-wrap gap-2">
                    {selectedBudget.procedures.map((procedure, index) => (
                      <Badge key={index} variant="outline">
                        {procedure}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    value={selectedBudget.notes}
                    disabled={!isEditMode}
                    onChange={(e) => setSelectedBudget({...selectedBudget, notes: e.target.value})}
                    rows={3}
                    placeholder="Observações adicionais..."
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
                      Salvar Orçamento
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit} className="bg-blue-600 hover:bg-blue-700">
                    <Edit2 size={16} className="mr-2" />
                    Editar Orçamento
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