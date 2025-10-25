import React from 'react';
import type { Pizza } from '../types';

interface PizzaCardProps {
  pizza: Pizza;
  onAddToCart: (pizza: Pizza) => void;
}

const PizzaCard: React.FC<PizzaCardProps> = ({ pizza, onAddToCart }) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 flex flex-col">
      <img src={pizza.imageUrl} alt={pizza.name} className="w-full h-48 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-brand-blue mb-2">{pizza.name}</h3>
        <p className="text-gray-700 text-sm mb-4 flex-grow">{pizza.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-lg font-semibold text-brand-dark">{pizza.price.toFixed(2).replace('.', ',')} €</p>
          <button
            onClick={() => onAddToCart(pizza)}
            className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300"
            aria-label={`Aggiungi ${pizza.name} al carrello`}
          >
            Aggiungi
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;