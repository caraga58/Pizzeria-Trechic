import React, { useState, useEffect, useRef } from 'react';

const PizzaIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-white" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C9.24 2 7 4.24 7 7s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
      <path d="M21.71 13.29l-3.42-3.42C17.66 9.25 16.85 9 16 9H8c-.85 0-1.66.25-2.29.87L2.29 13.29C1.9 13.68 1.9 14.31 2.29 14.71l8.29 8.29c.39.39 1.02.39 1.41 0l8.29-8.29c.4-.39.4-1.03.03-1.42zM12 20.59L4.41 13H12v7.59z"/>
    </svg>
);

const CartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

interface HeaderProps {
  onAdminClick: () => void;
  cartItemCount: number;
  onCartClick: () => void;
  isAdmin: boolean;
  onLogout: () => void;
  logoUrl: string | null;
}

const Header: React.FC<HeaderProps> = ({ onAdminClick, cartItemCount, onCartClick, isAdmin, onLogout, logoUrl }) => {
  const [animateCart, setAnimateCart] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Evita l'animazione al primo caricamento del componente
    if (isInitialMount.current) {
        isInitialMount.current = false;
        return;
    }

    // Attiva l'animazione
    setAnimateCart(true);
    
    // Rimuovi la classe di animazione dopo che è terminata per permettere di riattivarla
    const timer = setTimeout(() => {
        setAnimateCart(false);
    }, 400); // Deve corrispondere alla durata dell'animazione in index.html

    return () => clearTimeout(timer);
  }, [cartItemCount]);

  return (
    <header className="bg-brand-blue shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo Pizzeria Trechic" className="h-10 max-w-[150px] mr-3" />
            ) : (
              <PizzaIcon />
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-wider">
              Pizzeria Trechic
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onCartClick}
              className="relative text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={`Vai al carrello, ${cartItemCount} articoli`}
              disabled={cartItemCount === 0}
            >
              <CartIcon />
              {cartItemCount > 0 && (
                <span className={`absolute top-0 right-0 block h-5 w-5 rounded-full bg-brand-accent text-white text-xs flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 ${animateCart ? 'animate-bump' : ''}`}>
                  {cartItemCount}
                </span>
              )}
            </button>
            {isAdmin && (
               <button
                onClick={onLogout}
                className="bg-gray-600 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-300"
                aria-label="Logout"
              >
                Logout
              </button>
            )}
            <button
              onClick={onAdminClick}
              className="bg-white text-brand-blue font-bold py-2 px-4 rounded hover:bg-gray-200 transition-colors duration-300"
              aria-label="Pannello di Amministrazione"
            >
              Gestisci
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;