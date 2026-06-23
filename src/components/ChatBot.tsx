import { useState, useEffect, useRef } from "react";

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

const QUICK_QUESTIONS = [
  { text: "🎟️ ¿Hay algún cupón?", key: "coupon" },
  { text: "📦 ¿Cómo es el envío?", key: "shipping" },
  { text: "🔍 Categorías disponibles", key: "categories" },
  { text: "💡 ¿Es una tienda real?", key: "real" }
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "¡Hola! Soy tu asistente de AuraMarket. ¿En qué te puedo ayudar hoy? Puedes escribirme o usar las sugerencias de abajo.",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("cupon") || q.includes("descuento") || q.includes("código") || q.includes("codigo") || q.includes("coupon")) {
      return "¡Sí! Puedes utilizar el cupón secreto **AURA20** en el checkout para obtener un **20% de descuento** en el total de tu orden. 🎟️";
    }
    if (q.includes("envio") || q.includes("envío") || q.includes("costo") || q.includes("gratis") || q.includes("shipping")) {
      return "En AuraMarket todos los envíos son **100% gratuitos** a cualquier parte del país, sin compra mínima. El plazo estimado de entrega es de 2 a 5 días hábiles. 📦";
    }
    if (q.includes("categoria") || q.includes("categoría") || q.includes("ropa") || q.includes("electronica") || q.includes("electrónica")) {
      return "Contamos con una amplia variedad de productos agrupados en cuatro categorías principales: **Ropa**, **Electrónica**, **Accesorios** y **Hogar**. Puedes filtrarlas usando los chips interactivos en la página de inicio. 🔍";
    }
    if (q.includes("real") || q.includes("verdad") || q.includes("comprar") || q.includes("proyecto") || q.includes("simulado")) {
      return "AuraMarket es una tienda de demostración desarrollada como proyecto integrador. Todo el flujo de pagos, stock de productos y compras son simulaciones controladas. ¡Ninguna transacción es real! 💡";
    }
    return "Mmm... no estoy seguro de entender tu consulta. Prueba preguntándome sobre 'cupones', 'envíos', 'categorías' o haz clic en alguno de los botones rápidos de abajo. 😊";
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: "user",
      text: textToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");

    // Simulate bot typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botMsg: Message = {
        sender: "bot",
        text: getBotResponse(textToSend),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="glass-card w-[350px] sm:w-[380px] h-[480px] rounded-2xl flex flex-col mb-4 overflow-hidden border border-slate-800 shadow-2xl animate-fade-in relative z-50">
          {/* Chat Header */}
          <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-indigo-500/10">
                  AM
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
              </div>
              <div>
                <p className="font-bold text-white text-xs sm:text-sm">Asistente AuraMarket</p>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">En línea</p>
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950/30">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none"
                    : "bg-slate-900 border border-slate-800 text-slate-350 rounded-tl-none"
                }`}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 font-semibold mt-1 px-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none px-4 py-2.5 text-xs font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions */}
          <div className="px-4 py-2 bg-slate-950/40 border-t border-slate-850 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
            {QUICK_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.text)}
                className="text-[10px] font-bold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 px-3 py-1.5 rounded-full transition-all flex-shrink-0"
              >
                {q.text}
              </button>
            ))}
          </div>

          {/* Text Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-3 bg-slate-950/80 border-t border-slate-850 flex gap-2 items-center"
          >
            <input
              type="text"
              placeholder="Escribe tu consulta..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 glass-input px-3.5 py-2 rounded-xl text-xs placeholder:text-slate-500 font-semibold"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all active:scale-95 flex-shrink-0 shadow-md shadow-indigo-600/10"
            >
              <svg className="w-4.5 h-4.5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 glow-primary"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
