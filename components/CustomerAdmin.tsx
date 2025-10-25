import React, { useState } from 'react';
import type { Customer } from '../types';
import CustomerForm from './CustomerForm';

interface CustomerAdminProps {
  customers: Customer[];
  onSaveCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: number) => void;
}

const CustomerAdmin: React.FC<CustomerAdminProps> = ({ customers, onSaveCustomer, onDeleteCustomer }) => {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSave = (customer: Customer) => {
    onSaveCustomer(customer);
    handleCloseModal();
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-brand-dark mb-6">Gestione Clienti</h3>
      {customers.length === 0 ? (
        <p>Non ci sono ancora clienti registrati.</p>
      ) : (
        <div className="space-y-4">
          {customers.map(customer => (
            <div key={customer.id} className="flex items-center justify-between p-4 bg-brand-light rounded-lg border">
              <div>
                <p className="font-bold text-lg">{customer.name} {customer.surname}</p>
                <p className="text-sm text-gray-600">{customer.phone}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(customer)}
                  className="bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded hover:bg-gray-300 transition-colors"
                  aria-label={`Modifica ${customer.name} ${customer.surname}`}
                >
                  Modifica
                </button>
                <button
                  onClick={() => onDeleteCustomer(customer.id)}
                  className="bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded hover:bg-gray-400 transition-colors"
                  aria-label={`Elimina ${customer.name} ${customer.surname}`}
                >
                  Elimina
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {isModalOpen && editingCustomer && (
        <CustomerForm 
            customer={editingCustomer}
            onSave={handleSave}
            onCancel={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CustomerAdmin;