import React from 'react';
import PizzaCard from './PizzaCard';
import type { Pizza } from '../types';

interface MenuProps {
  menuItems: Pizza[];
  onAddToCart: (pizza: Pizza) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, onAddToCart }) => {
  return (
    <section id="menu" className="my-16">
      <h2 className="text-4xl font-bold text-center mb-4 text-brand-blue">Il Nostro Menù</h2>
      <p className="text-center text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
        Realizzate con tradizione e i migliori ingredienti. Ogni pizza racconta una storia di eredità italiana.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.map((pizza) => (
          <PizzaCard key={pizza.id} pizza={pizza} onAddToCart={onAddToCart} />
        ))}
      </div>
    </section>
  );
};

export default Menu;