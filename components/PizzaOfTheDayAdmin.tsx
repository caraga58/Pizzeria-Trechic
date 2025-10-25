import React, { useState, useEffect, FormEvent } from 'react';
import type { PizzaOfTheDayType } from '../types';
import { generatePizzaOfTheDay } from '../services/geminiService';

interface PizzaOfTheDayAdminProps {
  pizza: PizzaOfTheDayType | null;
  onSave: (pizza: PizzaOfTheDayType) => void;
}

const PizzaOfTheDayAdmin: React.FC<PizzaOfTheDayAdminProps> = ({ pizza, onSave }) => {
  const [formData, setFormData] = useState({
    recipeName: '',
    description: '',
    ingredients: '' // Stored as a comma-separated string for the textarea
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (pizza) {
      setFormData({
        recipeName: pizza.recipeName,
        description: pizza.description,
        ingredients: pizza.ingredients.join(', ')
      });
    }
  }, [pizza]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
        const generatedPizza = await generatePizzaOfTheDay();
        setFormData({
            recipeName: generatedPizza.recipeName,
            description: generatedPizza.description,
            ingredients: generatedPizza.ingredients.join(', ')
        });
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("Si è verificato un errore sconosciuto.");
        }
    } finally {
        setIsGenerating(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.recipeName || !formData.description || !formData.ingredients) {
        alert("Per favore, compila tutti i campi.");
        return;
    }
    const ingredientsArray = formData.ingredients.split(',').map(item => item.trim()).filter(Boolean);

    onSave({
        recipeName: formData.recipeName,
        description: formData.description,
        ingredients: ingredientsArray
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000); // Hide message after 2 seconds
  };


  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-2">
        <h3 className="text-2xl font-bold text-brand-dark">Imposta la Pizza del Giorno</h3>
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-brand-blue text-white font-bold py-2 px-4 rounded hover:bg-blue-800 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Generazione...</span>
            </>
          ) : (
            '✨ Genera con IA'
          )}
        </button>
      </div>
      <p className="text-gray-600 mb-6">Crea la specialità che verrà mostrata in primo piano sulla homepage, oppure usa l'IA per un'idea creativa!</p>
      
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-lg mb-4 text-center font-semibold">{error}</p>}
      
       <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="recipeName" className="block text-brand-dark font-semibold mb-1">Nome Specialità</label>
            <input
              type="text"
              id="recipeName"
              name="recipeName"
              value={formData.recipeName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Es. Delizia del Contadino"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-brand-dark font-semibold mb-1">Descrizione</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Una breve descrizione che faccia venire l'acquolina in bocca..."
              required
            ></textarea>
          </div>
           <div>
            <label htmlFor="ingredients" className="block text-brand-dark font-semibold mb-1">Ingredienti Principali</label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
              placeholder="Elenca gli ingredienti separati da una virgola (es. Mozzarella di bufala, Pomodorini, Basilico fresco)"
              required
            ></textarea>
          </div>
          <div className="flex items-center gap-4">
             <button
              type="submit"
              className="bg-brand-accent text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors"
            >
              Salva Pizza del Giorno
            </button>
            {isSaved && <p className="text-green-600 font-semibold animate-fade-in">Salvato con successo!</p>}
          </div>
        </form>
    </div>
  );
};

export default PizzaOfTheDayAdmin;
