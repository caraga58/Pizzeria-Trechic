import React from 'react';

interface AboutProps {
  aboutImageUrl: string;
}

const About: React.FC<AboutProps> = ({ aboutImageUrl }) => {
  return (
    <section id="about" className="my-16 bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-lg shadow-md">
      <div className="grid md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1">
          <img src={aboutImageUrl} alt="Interno della pizzeria" className="rounded-lg shadow-lg w-full h-auto object-cover"/>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-4xl font-bold text-brand-blue mb-4">La Nostra Storia</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Benvenuti alla Pizzeria Trechic, dove la passione per la tradizione incontra il gusto per l'innovazione. Nata dall'amore per l'autentica pizza italiana, abbiamo deciso di creare un'esperienza culinaria davvero unica. Il nostro impasto è steso a mano, le nostre salse sono fatte in casa ogni giorno e i nostri ingredienti provengono dai migliori produttori locali e italiani.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Cosa ci rende speciali? La nostra "Pizza del Giorno" è una creazione sempre nuova e stuzzicante, suggerita direttamente dalla creatività del nostro chef. È un assaggio di maestria, servito su una crosta perfetta.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;