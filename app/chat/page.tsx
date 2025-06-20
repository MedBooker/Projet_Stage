'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Send, Bot, User, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ChatPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string; id: string }[]>([
    { 
      role: 'assistant', 
      content: 'Bonjour ! Je suis AmiBot, votre assistant virtuel à la Clinique de l\'Amitié. 🌿\n\nComment puis-je vous aider aujourd\'hui ? ',
      id: '1'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    // Add user message
    const userMessage = { 
      role: 'user', 
      content: message,
      id: Date.now().toString() 
    };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ question: message })
      });

      if (!response.ok) {
        throw new Error('Erreur de réponse du serveur');
      }

      const data = await response.json();
      
      const botMessage = { 
        role: 'assistant', 
        content: data.reponse || "Je n'ai pas pu obtenir de réponse précise. Veuillez contacter notre accueil au 33 869 64 90.",
        id: Date.now().toString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur API:', error);
      toast.error("Problème de connexion", {
        description: "Veuillez réessayer ou contacter directement la clinique"
      });
      
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: "Désolé, je rencontre des difficultés techniques. 😔\n\nVous pouvez nous contacter directement :\n📞 33 869 64 90\n📞 77 822 92 45\n📍 Dakar, Sacré Coeur 3",
          id: Date.now().toString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-emerald-50/95 to-teal-50/95 dark:from-gray-950 dark:to-emerald-950/95">
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-10 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-emerald-100/50 dark:border-emerald-900/50 shadow-sm"
      >
        <div className="container mx-auto flex justify-between items-center max-w-6xl">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/80 text-emerald-600 dark:text-emerald-400 shadow-inner"
            >
              <Bot className="w-5 h-5" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">AmiBot Assistant</h1>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">Clinique de l'Amitié • Dakar</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              En ligne
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-emerald-600 dark:text-emerald-400"
              onClick={() => router.push('/contact')}
            >
              Contact humain
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto p-4 container mx-auto max-w-3xl">
        <div className="space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[90%] lg:max-w-[80%] px-4 py-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-md'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow border border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {msg.role === 'assistant' && (
                      <div className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    {msg.role === 'user' && (
                      <div className="p-1 rounded-full bg-emerald-700 text-white">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className={`text-xs mt-2 flex items-center gap-1 ${
                    msg.role === 'user' 
                      ? 'text-emerald-200 justify-end' 
                      : 'text-gray-500 dark:text-gray-400 justify-start'
                  }`}>
                    {msg.role === 'user' ? 'Vous' : 'AmiBot'} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none shadow border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm text-emerald-600 dark:text-emerald-300">AmiBot consulte nos ressources...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Area */}
      <motion.footer 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="sticky bottom-0 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-emerald-100/50 dark:border-emerald-900/50 shadow-lg"
      >
        <div className="container mx-auto max-w-3xl">
          <div className="relative flex gap-2">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Posez votre question..."
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              className="flex-1 pl-5 pr-12 py-4 rounded-full border border-emerald-200 dark:border-emerald-700 bg-white dark:bg-gray-800 focus-visible:ring-emerald-400 shadow-sm"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
              size="icon"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full ${
                message.trim() 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              } transition-all`}
              aria-label="Envoyer le message"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="mt-3 flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Réponses générées par notre système RAG • Consultez un professionnel pour des conseils médicaux
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}