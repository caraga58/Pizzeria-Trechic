import React, { useState } from 'react';
import type { Order, Customer, OrderStatus } from '../types';

interface OrderArchiveProps {
    orders: Order[];
    customers: Customer[];
    onUpdateOrderStatus: (orderId: number, status: OrderStatus) => void;
}

const ChevronIcon = ({ isExpanded }: { isExpanded: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const getStatusColorClasses = (status: OrderStatus) => {
    switch (status) {
        case 'In preparazione':
            return 'bg-yellow-100 text-yellow-800';
        case 'Pronto':
            return 'bg-blue-100 text-blue-800';
        case 'Consegnato':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

const OrderArchive: React.FC<OrderArchiveProps> = ({ orders, customers, onUpdateOrderStatus }) => {
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    const getCustomerById = (id: number) => {
        return customers.find(c => c.id === id);
    };

    const handleToggleDetails = (orderId: number) => {
        setExpandedOrderId(prevId => (prevId === orderId ? null : orderId));
    };

    const sortedOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    const statuses: OrderStatus[] = ['In preparazione', 'Pronto', 'Consegnato'];

    return (
        <div>
            <h3 className="text-2xl font-bold text-brand-dark mb-6">Archivio Ordini</h3>
            {sortedOrders.length === 0 ? (
                <p>Non ci sono ancora ordini registrati.</p>
            ) : (
                <div className="space-y-4">
                    {sortedOrders.map(order => {
                        const customer = getCustomerById(order.customerId);
                        const isExpanded = expandedOrderId === order.id;

                        return (
                             <div key={order.id} className="bg-brand-light rounded-lg border overflow-hidden shadow-sm animate-fade-in">
                                <button 
                                    className="w-full flex justify-between items-center p-4 text-left cursor-pointer hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                    onClick={() => handleToggleDetails(order.id)}
                                    aria-expanded={isExpanded}
                                    aria-controls={`order-details-${order.id}`}
                                >
                                    <div className="flex-grow text-left">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-bold text-lg text-brand-dark">Ordine #{order.id}</p>
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusColorClasses(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">
                                            {new Date(order.date).toLocaleString('it-IT')}
                                        </p>
                                        {customer && <p className="font-semibold text-gray-800 mt-1">{customer.name} {customer.surname}</p>}
                                    </div>
                                    <div className="flex items-center gap-4 ml-4">
                                        <p className="font-extrabold text-xl text-brand-blue">{order.total.toFixed(2).replace('.', ',')} €</p>
                                        <ChevronIcon isExpanded={isExpanded} />
                                    </div>
                                </button>
                                {isExpanded && (
                                     <div id={`order-details-${order.id}`} className="p-4 border-t bg-white animate-fade-in">
                                        {customer && (
                                            <div className="mb-4">
                                                <h4 className="font-semibold text-brand-blue">Dettagli Cliente:</h4>
                                                <p className="text-sm text-gray-700">Telefono: {customer.phone}</p>
                                            </div>
                                        )}
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-brand-blue mb-1">Pizze Ordinate:</h4>
                                            <ul className="list-disc list-inside pl-2 text-sm space-y-1">
                                                {order.items.map(item => (
                                                    <li key={`${order.id}-${item.id}`}>
                                                        {item.quantity} x <strong>{item.name}</strong>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-brand-blue mb-2">Modifica Stato</h4>
                                            <select
                                                value={order.status}
                                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                                                className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
                                                aria-label="Modifica stato ordine"
                                            >
                                                {statuses.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default OrderArchive;