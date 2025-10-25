import React, { useState, FormEvent } from 'react';
import type { Customer, Order, CartItem } from '../types';

interface CheckoutFormProps {
  onClose: () => void;
  onSubmit: (customerData: Omit<Customer, 'id'>) => void;
  cartItems: CartItem[];
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose, onSubmit, cartItems }) => {
  const [customer, setCustomer] = useState({ name: '', surname: '', phone: '' });

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.surname || !customer.phone) {
      alert("Per favore, compila tutti i campi.");
      return;
    }
    onSubmit(customer);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg m-4">
          <h2 className="text-2xl font-bold text-brand-blue mb-6">Completa il Tuo Ordine</h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-6 border">
            <h3 className="font-bold mb-2">Riepilogo Ordine</h3>
            <ul className="text-sm space-y-1">
              {cartItems.map(item => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.quantity} x {item.name}</span>
                  <span>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
                </li>
              ))}
            </ul>
            <p className="text-right font-bold mt-2 pt-2 border-t">Totale: {total.toFixed(2).replace('.', ',')} €</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-brand-dark font-semibold mb-1">Nome</label>
              <input type="text" id="name" name="name" value={customer.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent" required />
            </div>
            <div className="mb-4">
              <label htmlFor="surname" className="block text-brand-dark font-semibold mb-1">Cognome</label>
              <input type="text" id="surname" name="surname" value={customer.surname} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent" required />
            </div>
            <div className="mb-6">
              <label htmlFor="phone" className="block text-brand-dark font-semibold mb-1">Numero di Telefono</label>
              <input type="tel" id="phone" name="phone" value={customer.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent" required />
            </div>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors">Annulla</button>
              <button type="submit" className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">Conferma Ordine</button>
            </div>
          </form>
        </div>
      </div>
  )
}

interface ConfirmationProps {
    order: Order;
    customer: Customer;
    onClose: () => void;
    pizzeriaEmail: string;
    pizzeriaWhatsapp: string;
}

const Confirmation: React.FC<ConfirmationProps> = ({ order, customer, onClose, pizzeriaEmail, pizzeriaWhatsapp }) => {

    const generateOrderText = () => {
        const itemsText = order.items.map(item => `- ${item.quantity}x ${item.name}`).join('\n');
        return `
Nuovo Ordine #${order.id}

Cliente: ${customer.name} ${customer.surname}
Telefono: ${customer.phone}

Dettagli:
${itemsText}

TOTALE: ${order.total.toFixed(2).replace('.', ',')} €

Grazie!
        `.trim();
    };

    const orderText = generateOrderText();
    const mailtoHref = `mailto:${pizzeriaEmail}?subject=Nuovo Ordine #${order.id}&body=${encodeURIComponent(orderText)}`;
    const whatsappHref = `https://wa.me/${pizzeriaWhatsapp}?text=${encodeURIComponent(orderText)}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg m-4 text-center">
                <h2 className="text-3xl font-bold text-brand-blue mb-4">Grazie per il tuo Ordine!</h2>
                <p className="text-gray-700 mb-6">Il tuo ordine è stato registrato. Per completare, invialo alla pizzeria tramite WhatsApp o Email.</p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border text-left">
                    <h3 className="font-bold mb-2">Riepilogo Ordine #${order.id}</h3>
                     <ul className="text-sm space-y-1">
                        {order.items.map(item => (
                            <li key={item.id} className="flex justify-between">
                            <span>{item.quantity} x {item.name}</span>
                            <span>{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-right font-bold mt-2 pt-2 border-t">Totale: {order.total.toFixed(2).replace('.', ',')} €</p>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                     <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="bg-green-500 text-white font-bold py-3 px-6 rounded hover:bg-green-600 transition-colors w-full text-center">
                        Invia con WhatsApp
                    </a>
                    <a href={mailtoHref} className="bg-blue-500 text-white font-bold py-3 px-6 rounded hover:bg-blue-600 transition-colors w-full text-center">
                        Invia via Email
                    </a>
                </div>
                 <button onClick={onClose} className="mt-8 text-gray-600 hover:text-gray-900 font-semibold">Chiudi</button>
            </div>
        </div>
    )
};


const Checkout = Object.assign(CheckoutForm, { Confirmation });

export default Checkout;