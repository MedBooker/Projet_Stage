'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { 
      role: 'assistant', 
      content: 'Bonjour ! Je suis AmiBot, l\'assistant intelligent de la Clinique de l\'Amitié. 🌿 Posez-moi vos questions sur nos services médicaux, horaires ou spécialités.'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: message })
      });

      const data = await res.json();
      const botMessage = { 
        role: 'assistant', 
        content: data.reponse || "Je n'ai pas d'information précise. Contactez notre accueil au  33 869 64 90 / 77 822 92 45."
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "⚡ Problème de connexion. Veuillez réessayer ou contacter directement la clinique."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-900 dark:to-emerald-900/20">
      <header className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-800 shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-300">Clinique de l'Amitié</h1>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Dakar • Assistant Virtuel</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
            En ligne
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 container mx-auto max-w-3xl">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] lg:max-w-[80%] px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow border border-gray-100 dark:border-gray-700'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <div className={`text-xs mt-1 ${msg.role === 'user' ? 'text-emerald-200' : 'text-gray-500 dark:text-gray-400'}`}>
                  {msg.role === 'user' ? 'Vous' : 'AmiBot'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow border border-gray-100 dark:border-gray-700">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-sm ml-2 text-emerald-600 dark:text-emerald-300">Réponse en cours...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-emerald-100 dark:border-emerald-800">
        <div className="container mx-auto max-w-3xl">
          <div className="relative flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="flex-1 pl-5 pr-12 py-3 rounded-full border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full ${
                message.trim() 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              } transition-colors`}
              aria-label="Envoyer le message"
              title="Envoyer le message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className="text-center mt-3 text-xs text-emerald-600 dark:text-emerald-400">
            Réponses générées par intelligence artificielle • Consultez un professionnel pour des diagnostics
          </p>
        </div>
      </footer>
    </div>
  );
}