export interface Pizza {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export interface PizzaOfTheDayType {
  recipeName: string;
  description: string;
  ingredients: string[];
}

export interface CartItem extends Pizza {
  quantity: number;
}

export interface Customer {
    id: number;
    name: string;
    surname: string;
    phone: string;
}

export type OrderStatus = 'In preparazione' | 'Pronto' | 'Consegnato';

export interface Order {
    id: number;
    customerId: number;
    items: CartItem[];
    total: number;
    date: string;
    status: OrderStatus;
}