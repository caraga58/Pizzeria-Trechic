import React, { useState, useEffect, FormEvent } from 'react';
import type { Customer } from '../types';

interface CustomerFormProps {
  customer: Customer;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Customer>({ ...customer });

  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.phone) {
      alert("Per favore, compila tutti i campi.");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg m-4">
        <h2 className="text-2xl font-bold text-brand-blue mb-6">Modifica Cliente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-brand-dark font-semibold mb-1">Nome</label>
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
            <label htmlFor="surname" className="block text-brand-dark font-semibold mb-1">Cognome</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="phone" className="block text-brand-dark font-semibold mb-1">Telefono</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
              required
            />
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
              Salva Modifiche
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;