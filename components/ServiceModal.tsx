import React, { useState, useEffect } from 'react';
import { Service, ServiceFormData } from '../types';
import { COLORS } from '../constants';
import { X } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ServiceFormData) => void;
  initialData?: Service | null;
}

const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    duration: 60,
    recurrenceDays: 0,
    color: 'bg-gray-100',
    active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        price: initialData.price,
        cost: initialData.cost,
        duration: initialData.duration,
        recurrenceDays: initialData.recurrenceDays,
        color: initialData.color,
        active: initialData.active,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        cost: 0,
        duration: 60,
        recurrenceDays: 0,
        color: 'bg-gray-100',
        active: true,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'price' | 'cost') => {
    const val = parseFloat(e.target.value);
    setFormData(prev => ({ ...prev, [field]: isNaN(val) ? 0 : val }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? 'Editar Procedimento' : 'Novo Procedimento'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome*</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Avaliação Corporal"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none transition h-20"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Digite detalhes do procedimento..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Valor de Venda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valor de venda (R$)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border-2 border-purple-500 rounded-md focus:outline-none bg-purple-50"
                  value={formData.price}
                  onChange={(e) => handlePriceChange(e, 'price')}
                />
              </div>
            </div>

            {/* Custo Adicional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Custo adicional (R$)</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.cost}
                onChange={(e) => handlePriceChange(e, 'cost')}
              />
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cor*</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              >
                {COLORS.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duração */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
              />
            </div>

            {/* Tempo de reconsulta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tempo de reconsulta (dias)</label>
              <input
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                value={formData.recurrenceDays}
                onChange={(e) => setFormData({ ...formData, recurrenceDays: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          {/* Ativo Toggle */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                formData.active ? 'bg-green-500' : 'bg-gray-200'
              }`}
              onClick={() => setFormData({ ...formData, active: !formData.active })}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.active ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">Ativo</span>
          </div>

          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 shadow-sm"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceModal;
