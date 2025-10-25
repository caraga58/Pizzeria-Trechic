import React, { useState, useEffect, FormEvent } from 'react';
import type { Pizza } from '../types';

interface PizzaFormProps {
  pizza: Pizza | null;
  onSave: (pizza: Pizza) => void;
  onCancel: () => void;
}

const PizzaForm: React.FC<PizzaFormProps> = ({ pizza, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Pizza, 'id'>>({
    name: '',
    description: '',
    price: 0,
    imageUrl: ''
  });

  useEffect(() => {
    if (pizza) {
      setFormData({
        name: pizza.name,
        description: pizza.description,
        price: pizza.price,
        imageUrl: pizza.imageUrl
      });
    }
  }, [pizza]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) {
      alert("Per favore, inserisci un nome e un prezzo valido.");
      return;
    }
    if (!formData.imageUrl) {
      alert("Per favore, carica un'immagine per la pizza.");
      return;
    }
    onSave({
      ...formData,
      id: pizza?.id || 0 // id will be replaced in App.tsx for new pizzas
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-brand-blue mb-6">{pizza ? 'Modifica Pizza' : 'Aggiungi Nuova Pizza'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-brand-dark font-semibold mb-1">Nome Pizza</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-brand-dark font-semibold mb-1">Descrizione</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-brand-dark font-semibold mb-1">Prezzo (€)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="image" className="block text-brand-dark font-semibold mb-1">Immagine Pizza</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-brand-blue hover:file:bg-blue-200"
            />
             {formData.imageUrl && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Anteprima:</p>
                <img src={formData.imageUrl} alt="Anteprima" className="w-40 h-40 object-cover rounded-lg shadow-md" />
              </div>
            )}
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400 transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              {pizza ? 'Salva Modifiche' : 'Aggiungi Pizza'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PizzaForm;