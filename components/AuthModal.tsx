import React, { useState, useEffect, FormEvent } from 'react';
import { hashPassword, verifyPassword } from '../services/authService';

const PASSWORD_STORAGE_KEY = 'pizzeriaAdminPasswordHash';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [isPasswordSet, setIsPasswordSet] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkPassword = () => {
      const storedHash = localStorage.getItem(PASSWORD_STORAGE_KEY);
      setIsPasswordSet(!!storedHash);
      setIsLoading(false);
    };
    checkPassword();
  }, []);

  const handleSetup = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Le password non coincidono.');
      return;
    }

    try {
      const hash = await hashPassword(password);
      localStorage.setItem(PASSWORD_STORAGE_KEY, hash);
      onLoginSuccess();
    } catch (err) {
      setError('Errore durante il salvataggio della password.');
      console.error(err);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const storedHash = localStorage.getItem(PASSWORD_STORAGE_KEY);
    if (!storedHash) {
      setError('Nessuna password impostata. Si è verificato un errore.');
      return;
    }

    try {
      const isCorrect = await verifyPassword(password, storedHash);
      if (isCorrect) {
        onLoginSuccess();
      } else {
        setError('Password non corretta.');
      }
    } catch (err) {
       setError('Errore durante la verifica della password.');
       console.error(err);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <p>Caricamento...</p>;
    }

    if (!isPasswordSet) {
      // Setup Mode
      return (
        <>
          <h2 className="text-2xl font-bold text-brand-blue mb-4">Crea Password Amministratore</h2>
          <p className="mb-6 text-gray-600">Questa è la prima volta che accedi. Imposta una password per proteggere il pannello di amministrazione.</p>
          <form onSubmit={handleSetup}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-brand-dark font-semibold mb-1">Nuova Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-brand-dark font-semibold mb-1">Conferma Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>
            {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <div className="flex justify-end gap-4">
              <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">Annulla</button>
              <button type="submit" className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Imposta Password</button>
            </div>
          </form>
        </>
      );
    } else {
      // Login Mode
      return (
        <>
          <h2 className="text-2xl font-bold text-brand-blue mb-6">Accesso Amministratore</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="login_password" className="block text-brand-dark font-semibold mb-1">Password</label>
              <input
                type="password"
                id="login_password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
                required
              />
            </div>
             {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
            <div className="flex justify-end gap-4">
              <button type="button" onClick={onClose} className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-400">Annulla</button>
              <button type="submit" className="bg-brand-accent text-white font-bold py-2 px-4 rounded hover:bg-blue-700">Accedi</button>
            </div>
          </form>
        </>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md m-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default AuthModal;