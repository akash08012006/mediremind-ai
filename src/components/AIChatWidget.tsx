import { useState, useRef, useEffect, FormEvent } from 'react';
import { MessageSquare, Send, Mic, X, Bot, User, Sparkles, ShieldCheck, Maximize2, Minimize2 } from 'lucide-react';
import { sendMessage, getChatHistory, clearChatHistory, getSuggestedPrompts, ChatMessage } from '../services/aiChatService';

interface AIChatWidgetProps {
  visible?: boolean;
}

export default function AIChatWidget({ visible = true }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const history = getChatHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      const welcomeMessage: ChatMessage = {
        id: 'widget-welcome-' + Date.now(),
        role: 'assistant',
        content: 'Hello! I am your AI medication reminder assistant. How can I help you today?\n\nI am an AI medication reminder assistant. I do not provide medical advice. Please consult your doctor for medical decisions.',
        timestamp: Date.now(),
        suggestedActions: [
          'What medicine should I take now?',
          'Show today\'s medicines',
          'Show pending medicines',
          'Show missed medicines',
          'Show my caretaker details',
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setIsTyping(true);

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await sendMessage(userMessage);
      setMessages(prev => [...prev, response]);
    } catch {
      const errorMsg: ChatMessage = {
        id: 'error-' + Date.now(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.\n\nI am an AI medication reminder assistant. I do not provide medical advice. Please consult your doctor for medical decisions.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestedAction = (action: string) => {
    setInput(action);
    inputRef.current?.focus();
  };

  const handleClearChat = () => {
    clearChatHistory();
    setMessages([]);
    setShowClearConfirm(false);
    const welcomeMessage: ChatMessage = {
      id: 'widget-welcome-' + Date.now(),
      role: 'assistant',
      content: 'Chat cleared. How can I help you with your medication reminders today?\n\nI am an AI medication reminder assistant. I do not provide medical advice. Please consult your doctor for medical decisions.',
      timestamp: Date.now(),
      suggestedActions: [
        'What medicine should I take now?',
        'Show today\'s medicines',
        'Show pending medicines',
        'Show missed medicines',
        'Show my caretaker details',
      ],
    };
    setMessages([welcomeMessage]);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const suggestedPrompts = getSuggestedPrompts();

  if (!visible) return null;

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-blue-600 via-blue-600 to-emerald-500 text-white shadow-2xl hover:shadow-blue-500/40 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
          id="ai-chat-widget-toggle"
          title="Open AI Assistant"
        >
          <div className="relative">
            <MessageSquare className="w-7 h-7 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-sm" />
          </div>
          <div className="absolute inset-0 rounded-full bg-blue-400/30 animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`
            fixed z-50 bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/80 flex flex-col overflow-hidden
            transition-all duration-500 ease-out
            ${isMaximized 
              ? 'inset-4 md:inset-8 rounded-3xl' 
              : 'bottom-6 right-6 w-[95vw] sm:w-[420px] h-[65vh] sm:h-[620px] max-h-[80vh] rounded-3xl'
            }
          `}
          id="ai-chat-widget-panel"
          style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)' }}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 via-blue-600 to-emerald-500 px-5 py-4 flex items-center justify-between text-white overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
            <div className="relative flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  MediRemind AI
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold border border-white/20">
                    <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
                    Online
                  </span>
                </h3>
                <p className="text-[11px] text-blue-100 font-medium">Medication Assistant</p>
              </div>
            </div>
            <div className="relative flex items-center gap-1">
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                title={isMaximized ? 'Minimize' : 'Maximize'}
              >
                {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                id="close-widget-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 bg-gradient-to-b from-slate-50/80 to-white" id="widget-messages">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 h-9 w-9 rounded-xl flex items-center justify-center shadow-lg ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white' 
                      : 'bg-gradient-to-br from-blue-600 to-emerald-500 text-white'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`
                    max-w-[80%] rounded-2xl px-4 py-3 shadow-sm relative
                    ${message.role === 'user'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-md'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-md'
                    }
                  `}
                  style={{
                    boxShadow: message.role === 'user' 
                      ? '0 4px 12px -2px rgba(37, 99, 235, 0.3)' 
                      : '0 2px 8px -2px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  <div className="text-[13px] leading-relaxed whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-[10px] mt-2 flex items-center gap-1 font-medium ${message.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                    {formatTime(message.timestamp)}
                  </div>

                  {/* Suggested Actions */}
                  {message.suggestedActions && message.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-100/80 space-y-2">
                      <div className="flex flex-wrap gap-1.5">
                        {message.suggestedActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestedAction(action)}
                            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-all cursor-pointer border border-blue-100 hover:border-blue-200 hover:shadow-sm"
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3" id="widget-typing-indicator">
                <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white flex items-center justify-center shadow-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 1 && !isTyping && (
            <div className="px-5 pb-3 bg-gradient-to-b from-white to-slate-50/80" id="widget-suggested-prompts">
              <div className="flex items-center gap-2 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Quick Actions</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.slice(0, 4).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedAction(prompt)}
                    className="px-3 py-2 rounded-xl bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-medium text-slate-700 hover:text-blue-700 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-white/80 backdrop-blur-md border-t border-slate-200/80 px-4 py-3.5" id="widget-input-area">
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <div className="flex-1 relative group">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your medicines..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-sm transition-all shadow-sm"
                  disabled={isTyping}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 disabled:from-slate-300 disabled:to-slate-300 text-white shadow-lg hover:shadow-blue-500/30 transition-all cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
                style={{ boxShadow: input.trim() && !isTyping ? '0 4px 14px -2px rgba(37, 99, 235, 0.4)' : 'none' }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="flex items-center justify-between mt-2.5 px-1">
              <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Not medical advice
              </p>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-[10px] text-slate-400 hover:text-red-600 transition-colors cursor-pointer font-medium flex items-center gap-1"
              >
                Clear chat
              </button>
            </div>
          </div>

          {/* Clear Chat Modal */}
          {showClearConfirm && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 rounded-3xl z-10" id="widget-clear-modal">
              <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full p-5 space-y-4 border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Clear Chat History?</h4>
                    <p className="text-[11px] text-slate-500">This will erase your current conversation.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearChat}
                    className="flex-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer shadow-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
