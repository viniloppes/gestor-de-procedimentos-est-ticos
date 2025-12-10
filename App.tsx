import React, { useState, useEffect } from 'react';
import { Plus, Copy, Search, Edit2, Trash2, Clock, RotateCcw } from 'lucide-react';
import { Service, ServiceFormData } from './types';
import { parseInitialData, formatCurrency, generateWhatsAppText } from './utils';
import ServiceModal from './components/ServiceModal';

const App: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCopyToast, setShowCopyToast] = useState(false);

  // Load data from LocalStorage or Initial Constants
  useEffect(() => {
    const stored = localStorage.getItem('estetica_services');
    if (stored) {
      try {
        setServices(JSON.parse(stored));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
        const initial = parseInitialData();
        setServices(initial);
      }
    } else {
      const initial = parseInitialData();
      setServices(initial);
      localStorage.setItem('estetica_services', JSON.stringify(initial));
    }
  }, []);

  // Sync to LocalStorage whenever services change
  useEffect(() => {
    if (services.length > 0) {
      localStorage.setItem('estetica_services', JSON.stringify(services));
    }
  }, [services]);

  const handleSaveService = (data: ServiceFormData) => {
    if (editingService) {
      // Update
      setServices(prev => prev.map(s => 
        s.id === editingService.id ? { ...data, id: editingService.id } : s
      ));
    } else {
      // Create
      const newService: Service = {
        ...data,
        id: crypto.randomUUID(),
      };
      setServices(prev => [newService, ...prev]);
    }
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este procedimento?')) {
      setServices(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setIsModalOpen(true);
  };

  const handleCopyToWhatsApp = () => {
    const text = generateWhatsAppText(services);
    navigator.clipboard.writeText(text).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 3000);
    });
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Procedimentos Estéticos</h1>
              <p className="text-sm text-gray-500">{services.length} serviços cadastrados</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddNew}
                className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Plus size={18} className="mr-2" />
                Novo
              </button>
              <button
                onClick={handleCopyToWhatsApp}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Copy size={18} className="mr-2" />
                Copiar Lista
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar procedimento..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum procedimento encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <div 
                key={service.id} 
                className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col ${!service.active ? 'opacity-60 grayscale' : ''}`}
              >
                {/* Color Strip */}
                <div className={`h-2 w-full ${service.color}`}></div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight line-clamp-2">
                      {service.name}
                    </h3>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(service.price)}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      {service.duration > 0 && (
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          <span>{service.duration} min</span>
                        </div>
                      )}
                      {service.recurrenceDays > 0 && (
                         <div className="flex items-center">
                         <RotateCcw size={14} className="mr-1" />
                         <span>{service.recurrenceDays}d</span>
                       </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-end space-x-2">
                  <button 
                    onClick={() => handleEdit(service)}
                    className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <ServiceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
        initialData={editingService}
      />

      {/* Toast Notification */}
      {showCopyToast && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center animate-bounce-short z-50">
          <Copy size={20} className="mr-2 text-green-400" />
          <span>Texto copiado para a área de transferência!</span>
        </div>
      )}
    </div>
  );
};

export default App;
