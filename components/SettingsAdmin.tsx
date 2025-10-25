import React, { useState, useEffect, FormEvent } from 'react';

interface SettingsAdminProps {
  email: string;
  whatsapp: string;
  aboutImageUrl: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
  onSave: (
    email: string, 
    whatsapp: string, 
    aboutImageUrl: string, 
    logoUrl: string | null, 
    backgroundUrl: string | null
  ) => void;
}

const SettingsAdmin: React.FC<SettingsAdminProps> = ({ email, whatsapp, aboutImageUrl, logoUrl, backgroundUrl, onSave }) => {
  const [formData, setFormData] = useState({ email, whatsapp, aboutImageUrl, logoUrl, backgroundUrl });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setFormData({ email, whatsapp, aboutImageUrl, logoUrl, backgroundUrl });
  }, [email, whatsapp, aboutImageUrl, logoUrl, backgroundUrl]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'aboutImageUrl' | 'logoUrl' | 'backgroundUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.whatsapp) {
      alert("Per favore, compila tutti i campi di contatto.");
      return;
    }
    onSave(formData.email, formData.whatsapp, formData.aboutImageUrl, formData.logoUrl, formData.backgroundUrl);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const ImageInput: React.FC<{
    id: string;
    label: string;
    imageUrl: string | null;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove: () => void;
    previewClass?: string;
  }> = ({ id, label, imageUrl, onFileChange, onRemove, previewClass = "w-48 h-48" }) => (
    <div>
      <label htmlFor={id} className="block text-brand-dark font-semibold mb-1">{label}</label>
      <input
        type="file"
        id={id}
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        onChange={onFileChange}
        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-brand-blue hover:file:bg-blue-200"
      />
      {imageUrl && (
        <div className="mt-4 relative inline-block">
          <p className="text-sm font-semibold mb-2">Anteprima:</p>
          <img src={imageUrl} alt="Anteprima" className={`${previewClass} object-cover rounded-lg shadow-md`} />
          <button
              type="button"
              onClick={onRemove}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full h-7 w-7 flex items-center justify-center -mt-1 -mr-1 hover:bg-red-700 transition-colors"
              aria-label="Rimuovi immagine"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <h3 className="text-2xl font-bold text-brand-dark mb-6">Impostazioni Pizzeria</h3>
      
      <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
        <div className="p-6 border rounded-lg">
            <h4 className="text-xl font-semibold text-brand-dark mb-2">Informazioni di Contatto</h4>
            <p className="text-gray-600 mb-4">Modifica l'email e il numero WhatsApp dove riceverai le notifiche degli ordini.</p>
            <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-brand-dark font-semibold mb-1">Indirizzo Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleTextChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    placeholder="es. info@pizzeriatrechic.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block text-brand-dark font-semibold mb-1">Numero WhatsApp</label>
                  <input
                    type="tel"
                    id="whatsapp"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleTextChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    placeholder="es. 393331234567"
                    required
                  />
                   <p className="text-xs text-gray-500 mt-1">Includi il prefisso internazionale (es. 39 per l'Italia) senza il '+' o '00'.</p>
                </div>
            </div>
        </div>

        <div className="p-6 border rounded-lg space-y-6">
            <h4 className="text-xl font-semibold text-brand-dark mb-2">Branding e Personalizzazione</h4>
            <ImageInput
              id="logoImage"
              label="Carica Logo (verrà mostrato nell'header)"
              imageUrl={formData.logoUrl}
              onFileChange={(e) => handleFileChange(e, 'logoUrl')}
              onRemove={() => setFormData(prev => ({ ...prev, logoUrl: null }))}
              previewClass="w-32 h-auto bg-gray-200 p-2 rounded"
            />
             <ImageInput
              id="backgroundImage"
              label="Carica Immagine di Sfondo"
              imageUrl={formData.backgroundUrl}
              onFileChange={(e) => handleFileChange(e, 'backgroundUrl')}
              onRemove={() => setFormData(prev => ({ ...prev, backgroundUrl: null }))}
              previewClass="w-48 h-32"
            />
            <ImageInput
              id="aboutImage"
              label="Immagine 'La Nostra Storia'"
              imageUrl={formData.aboutImageUrl}
              onFileChange={(e) => handleFileChange(e, 'aboutImageUrl')}
              onRemove={() => setFormData(prev => ({ ...prev, aboutImageUrl: "" }))}
              previewClass="w-48 h-48"
            />
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            className="bg-brand-accent text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition-colors"
          >
            Salva Tutte le Impostazioni
          </button>
          {isSaved && <p className="text-green-600 font-semibold animate-fade-in">Salvato con successo!</p>}
        </div>
      </form>
    </div>
  );
};

export default SettingsAdmin;