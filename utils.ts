import { Service } from './types';
import { INITIAL_RAW_DATA } from './constants';

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const parseCurrencyString = (value: string): number => {
  // Removes R$, spaces, replaces dots with nothing, replaces comma with dot
  const clean = value.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
};

export const parseInitialData = (): Service[] => {
  const lines = INITIAL_RAW_DATA.split('\n').filter(line => line.trim() !== '');
  const services: Service[] = [];
  
  let currentName = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Regex matches "-60R$ 150,00" format: -(Duration)R$ (Price)
    const match = line.match(/^-(\d+)R\$\s*([\d.,]+)/);

    if (match) {
      // This is a details line, it belongs to the previous name
      const duration = parseInt(match[1], 10);
      const priceString = match[2];
      const price = parseCurrencyString(priceString);

      if (currentName) {
        services.push({
          id: crypto.randomUUID(),
          name: currentName,
          description: '',
          price: price,
          cost: 0,
          duration: duration,
          recurrenceDays: 0,
          color: 'bg-gray-100',
          active: true
        });
        currentName = ''; // Reset
      }
    } else {
      // This is likely a name
      currentName = line;
    }
  }

  return services;
};

export const generateWhatsAppText = (services: Service[]): string => {
  const activeServices = services.filter(s => s.active);
  let text = "*TABELA DE PROCEDIMENTOS*\n\n";

  activeServices.forEach(service => {
    const price = formatCurrency(service.price);
    const duration = service.duration > 0 ? ` (${service.duration} min)` : '';
    text += `*${service.name}*\nValor: ${price}${duration}\n\n`;
  });

  text += "_Agende seu horário!_";
  return text;
};
