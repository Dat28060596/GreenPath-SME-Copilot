import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, FileText, Loader2 } from 'lucide-react';
import { ChatMessage, Question } from '../types';
import { generateCopilotResponse } from '../services/geminiService';
import ReactMarkdown from 'react-markdown'; // Ensure this is conceptually here, though in this env we might just render text

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  contextPage: string;
  selectedQuestion?: Question | null;
}

const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose, contextPage, selectedQuestion }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi! I'm your ESG Copilot. I can help you understand questions, calculate metrics, or draft content for your report. How can I help today?",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Context awareness greeting update
  useEffect(() => {
    if (isOpen && selectedQuestion) {
        // Subtle hint that the bot knows what the user is doing
        const hintId = `hint-${selectedQuestion.id}`;
        if (!messages.find(m => m.id === hintId)) {
             setMessages(prev => [...prev, {
                id: hintId,
                role: 'model',
                text: `I see you're working on **${selectedQuestion.topic}**. Need help with definitions or calculations for *${selectedQuestion.text}*?`,
                timestamp: new Date()
            }]);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedQuestion, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await generateCopilotResponse(userMsg.text, {
        page: contextPage,
        selectedQuestion
      });

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl border-l border-slate-200 z-40 flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="h-16 border-b border-slate-100 flex items-center justify-between px-4 bg-indigo-50">
        <div className="flex items-center gap-2 text-indigo-700">
          <Sparkles size={20} />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-200">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
              }`}
            >
              {/* Simple Markdown Rendering simulation */}
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Thinking...</span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips (Contextual) */}
      {selectedQuestion && !isLoading && (
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 overflow-x-auto flex gap-2 no-scrollbar">
              <button 
                onClick={() => setInputValue(`Help me estimate ${selectedQuestion.topic} data`)}
                className="whitespace-nowrap px-3 py-1 bg-white border border-indigo-200 text-indigo-600 text-xs rounded-full hover:bg-indigo-50"
              >
                  How to estimate?
              </button>
              <button 
                onClick={() => setInputValue(`Draft a justification for ${selectedQuestion.topic}`)}
                className="whitespace-nowrap px-3 py-1 bg-white border border-indigo-200 text-indigo-600 text-xs rounded-full hover:bg-indigo-50"
              >
                  Draft response
              </button>
          </div>
      )}

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2 border border-transparent focus-within:border-indigo-300 focus-within:bg-white transition-colors">
          <input
            type="text"
            className="flex-1 bg-transparent outline-none text-sm text-slate-800 placeholder-slate-400"
            placeholder="Ask Copilot..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={isLoading}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-[10px] text-center text-slate-400 mt-2">
            AI can make mistakes. Please verify important info.
        </div>
      </div>
    </div>
  );
};

export default CopilotDrawer;