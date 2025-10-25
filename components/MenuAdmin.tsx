import React, { useState, useEffect } from 'react';
import type { Pizza, Order, Customer, PizzaOfTheDayType, OrderStatus } from '../types';
import PizzaForm from './PizzaForm';
import OrderArchive from './OrderArchive';
import CustomerAdmin from './CustomerAdmin';
import PizzaOfTheDayAdmin from './PizzaOfTheDayAdmin';
import SettingsAdmin from './SettingsAdmin';

interface MenuAdminProps {
  menuItems: Pizza[];
  onSavePizza: (pizza: Pizza) => void;
  onDeletePizza: (pizzaId: number) => void;
  orders: Order[];
  customers: Customer[];
  onSaveCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: number) => void;
  onRefreshData: () => void;
  pizzaOfTheDay: PizzaOfTheDayType | null;
  onSavePizzaOfTheDay: (pizza: PizzaOfTheDayType) => void;
  pizzeriaEmail: string;
  pizzeriaWhatsapp: string;
  aboutImageUrl: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
  onSaveSettings: (
    email: string, 
    whatsapp: string, 
    imageUrl: string, 
    logoUrl: string | null, 
    backgroundUrl: string | null
  ) => void;
  onUpdateOrderStatus: (orderId: number, status: OrderStatus) => void;
}

type AdminTab = 'menu' | 'orders' | 'customers' | 'special' | 'settings';

const MenuAdmin: React.FC<MenuAdminProps> = ({ 
  menuItems, onSavePizza, onDeletePizza, 
  orders, customers, onSaveCustomer, onDeleteCustomer, 
  onRefreshData, pizzaOfTheDay, onSavePizzaOfTheDay,
  pizzeriaEmail, pizzeriaWhatsapp, aboutImageUrl, 
  logoUrl, backgroundUrl, onSaveSettings,
  onUpdateOrderStatus
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPizza, setEditingPizza] = useState<Pizza | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('menu');

  useEffect(() => {
    let intervalId: number | undefined;

    if (activeTab === 'orders') {
      intervalId = window.setInterval(() => {
        onRefreshData();
      }, 30000); 
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activeTab, onRefreshData]);


  const handleAddNew = () => {
    setEditingPizza(null);
    setIsModalOpen(true);
  };

  const handleEdit = (pizza: Pizza) => {
    setEditingPizza(pizza);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPizza(null);
  };

  const handleSave = (pizza: Pizza) => {
    onSavePizza(pizza);
    handleCloseModal();
  };
  
  const TabButton: React.FC<{tab: AdminTab, label: string}> = ({ tab, label }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${activeTab === tab ? 'bg-white text-brand-blue border-b-0' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
    >
        {label}
    </button>
  );

  return (
    <section id="admin" className="my-12 border-2 border-brand-blue rounded-lg shadow-md">
      <div className="flex border-b-2 border-brand-blue flex-wrap">
          <TabButton tab="menu" label="Gestione Menù" />
          <TabButton tab="special" label="Pizza del Giorno" />
          <TabButton tab="orders" label="Archivio Ordini" />
          <TabButton tab="customers" label="Gestione Clienti" />
          <TabButton tab="settings" label="Impostazioni" />
      </div>
      <div className="p-8 bg-white/95 backdrop-blur-sm rounded-b-lg">
        {activeTab === 'menu' && (
           <div>
            <div className="mb-6">
              <button
                onClick={handleAddNew}
                className="bg-brand-accent text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors duration-300"
              >
                Aggiungi Nuova Pizza
              </button>
            </div>
            <div className="space-y-4">
              {menuItems.map(pizza => (
                <div key={pizza.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <img src={pizza.imageUrl} alt={pizza.name} className="w-16 h-16 rounded-md object-cover" />
                    <div>
                      <p className="font-bold text-lg">{pizza.name}</p>
                      <p className="text-sm text-gray-600">{pizza.price.toFixed(2).replace('.', ',')} €</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(pizza)}
                      className="bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded hover:bg-gray-300 transition-colors"
                      aria-label={`Modifica ${pizza.name}`}
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Sei sicuro di voler eliminare la pizza "${pizza.name}"?`)) {
                          onDeletePizza(pizza.id);
                        }
                      }}
                      className="bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded hover:bg-gray-400 transition-colors"
                      aria-label={`Elimina ${pizza.name}`}
                    >
                      Elimina
                    </button>
                  </div>
                </div>
              ))}
            </div>
           </div>
        )}
        {activeTab === 'special' && (
            <PizzaOfTheDayAdmin 
                pizza={pizzaOfTheDay}
                onSave={onSavePizzaOfTheDay}
            />
        )}
        {activeTab === 'orders' && (
            <OrderArchive 
              orders={orders} 
              customers={customers} 
              onUpdateOrderStatus={onUpdateOrderStatus} 
            />
        )}
        {activeTab === 'customers' && (
            <CustomerAdmin 
                customers={customers}
                onSaveCustomer={onSaveCustomer}
                onDeleteCustomer={onDeleteCustomer}
            />
        )}
        {activeTab === 'settings' && (
            <SettingsAdmin
                email={pizzeriaEmail}
                whatsapp={pizzeriaWhatsapp}
                aboutImageUrl={aboutImageUrl}
                logoUrl={logoUrl}
                backgroundUrl={backgroundUrl}
                onSave={onSaveSettings}
            />
        )}
      </div>

      {isModalOpen && (
        <PizzaForm
          pizza={editingPizza}
          onSave={handleSave}
          onCancel={handleCloseModal}
        />
      )}
    </section>
  );
};

export default MenuAdmin;