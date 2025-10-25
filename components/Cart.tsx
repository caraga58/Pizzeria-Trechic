import React from 'react';
import type { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (pizzaId: number, quantity: number) => void;
  onClose: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, onUpdateQuantity, onClose, onCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl w-full max-w-2xl m-4 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-brand-blue">Il Tuo Ordine</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-800" aria-label="Chiudi carrello">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        {cartItems.length === 0 ? (
            <p className="text-center text-gray-600 py-8">Il tuo carrello è vuoto.</p>
        ) : (
            <div className="flex-grow overflow-y-auto pr-2 -mr-2">
                {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 rounded-md object-cover"/>
                        <div className="flex-grow">
                            <p className="font-bold">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.price.toFixed(2).replace('.', ',')} €</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <input 
                                type="number" 
                                value={item.quantity} 
                                onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                                className="w-16 p-1 border rounded text-center"
                                min="1"
                                aria-label={`Quantità per ${item.name}`}
                            />
                        </div>
                        <p className="font-semibold w-20 text-right">{(item.price * item.quantity).toFixed(2).replace('.', ',')} €</p>
                        <button onClick={() => onUpdateQuantity(item.id, 0)} className="text-red-500 hover:text-red-700" aria-label={`Rimuovi ${item.name}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                    </div>
                ))}
            </div>
        )}

        {cartItems.length > 0 && (
            <div className="mt-6 pt-6 border-t">
                <div className="flex justify-end items-center mb-6">
                    <span className="text-xl font-bold">Totale:</span>
                    <span className="text-2xl font-extrabold text-brand-blue ml-4">{total.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex justify-end gap-4">
                     <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded hover:bg-gray-400 transition-colors"
                    >
                        Continua a Scegliere
                    </button>
                    <button
                        type="button"
                        onClick={onCheckout}
                        className="bg-brand-accent text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors"
                    >
                        Procedi all'Ordine
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Cart;