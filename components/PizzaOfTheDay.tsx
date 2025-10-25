import React from 'react';
import type { PizzaOfTheDayType } from '../types';

interface PizzaOfTheDayProps {
  pizza: PizzaOfTheDayType | null;
}

const PizzaOfTheDay: React.FC<PizzaOfTheDayProps> = ({ pizza }) => {
  return (
    <section id="special" className="mb-16 text-center">
      <div className="bg-brand-blue p-4 rounded-t-lg inline-block">
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
          Pizza del Giorno
        </h2>
        <p className="text-blue-200 font-semibold">La Specialità dello Chef</p>
      </div>

      <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-2xl border-4 border-brand-blue transform -translate-y-2 min-h-[280px] flex items-center justify-center">
        {pizza ? (
          <div className="text-left max-w-3xl mx-auto animate-fade-in">
            <h3 className="text-3xl font-extrabold text-brand-dark mb-3">{pizza.recipeName}</h3>
            <p className="text-lg text-gray-600 mb-6 italic">"{pizza.description}"</p>
            <div>
              <h4 className="text-xl font-bold text-brand-blue mb-2 border-b-2 border-brand-accent pb-1 inline-block">Ingredienti</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {pizza.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-xl font-semibold">La specialità del giorno è in preparazione!</p>
            <p>Torna più tardi per scoprire la delizia di oggi.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default PizzaOfTheDay;