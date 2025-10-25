import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-blue text-white mt-12">
      <div className="container mx-auto px-4 py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Pizzeria Trechic. Tutti i diritti riservati.</p>
        <p className="text-sm mt-1 text-gray-300">Viale Della Vittoria, 105 - 92024 Canicattì (AG)</p>
      </div>
    </footer>
  );
};

export default Footer;