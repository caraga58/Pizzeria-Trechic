import type { Pizza } from './types';

export const DEFAULT_PIZZERIA_EMAIL = "tua.email@pizzeria.com";
export const DEFAULT_PIZZERIA_WHATSAPP_NUMBER = "391234567890"; // Includere il prefisso internazionale senza '+' o '00'
export const DEFAULT_ABOUT_IMAGE_URL = "https://picsum.photos/seed/pizzeria/600/600";

export const INITIAL_MENU_ITEMS: Pizza[] = [
  {
    id: 1,
    name: 'Margherita Classica',
    description: 'Mozzarella fresca, pomodori San Marzano, basilico fresco e un filo d\'olio extra vergine d\'oliva.',
    price: 12.50,
    imageUrl: 'https://picsum.photos/seed/margherita/600/400',
  },
  {
    id: 2,
    name: 'Festa di Salamino Piccante',
    description: 'Un generoso strato di salamino piccante su mozzarella fusa e la nostra salsa di pomodoro firmata.',
    price: 14.00,
    imageUrl: 'https://picsum.photos/seed/pepperoni/600/400',
  },
  {
    id: 3,
    name: 'Verdure dell\'Ortolano',
    description: 'Una delizia del giardino con zucchine grigliate, peperoni, melanzane e cipolle su una base di formaggio.',
    price: 13.50,
    imageUrl: 'https://picsum.photos/seed/veggie/600/400',
  },
  {
    id: 4,
    name: 'Quattro Formaggi',
    description: 'Il sogno di ogni amante del formaggio con mozzarella, gorgonzola, parmigiano e ricotta.',
    price: 15.00,
    imageUrl: 'https://picsum.photos/seed/cheese/600/400',
  },
  {
    id: 5,
    name: 'Prosciutto e Funghi',
    description: 'Combinazione classica di saporito prosciutto cotto e funghi.',
    price: 14.50,
    imageUrl: 'https://picsum.photos/seed/prosciutto/600/400',
  },
  {
    id: 6,
    name: 'Diavola',
    description: 'Salame piccante, scaglie di peperoncino e olive nere per un tocco di fuoco.',
    price: 14.00,
    imageUrl: 'https://picsum.photos/seed/diavola/600/400',
  },
];