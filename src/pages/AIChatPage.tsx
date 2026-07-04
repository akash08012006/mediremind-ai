import { useState, useEffect, useRef, FormEvent } from 'react';
import {
  MessageSquare,
  Send,
  Mic,
  Trash2,
  Menu,
  X,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Clock,
  Pill,
  Calendar,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  History,
  Settings,
} from 'lucide-react';
import { sendMessage, getChatHistory, clearChatHistory, getSuggestedPrompts, ChatMessage } from '../services/aiChatService';

interface AIChatPageProps {
  userName: string | null;
}

export default function AIChatPage({ userName }: AIChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = getChatHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      const welcomeMessage: ChatMessage = {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: `Hello${userName ? `, ${userName}` : ''}! I am your AI medication reminder assistant. I can help you with your medicine schedule, reminders, and caretaker information.\n\nI am an AI medication reminder assistant. I do not provide medical advice. Please consult your doctor for medical decisions.`,
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
  }, [userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

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
        content: 'Sorry, I encountered an error. Please try again.\n\n' + 'I am an AI medication reminder assistant. I do not provide medical advice. Please consult your doctor for medical decisions.',
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
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content: `Chat cleared. How can I help you with your medication reminders today?\n\nI am an AI medication reminder assistant. I do not provide medical advice. Please consult your doctor for medical decisions.`,
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

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const suggestedPrompts = getSuggestedPrompts();

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-50/50" id="ai-chat-page-root">
      
      {/* Sidebar - Chat History */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        id="ai-chat-sidebar"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900">MediRemind AI</h2>
              <p className="text-[10px] text-slate-500">Chat History</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
            id="close-sidebar-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Actions */}
        <div className="p-3 space-y-2">
          <button
            onClick={() => setShowClearConfirm(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
            id="clear-chat-btn"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat History
          </button>
        </div>

        {/* Sidebar Disclaimer */}
        <div className="px-3 pb-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Safety Notice</span>
            </div>
            <p className="text-[10px] text-amber-800 leading-relaxed">
              I do not provide medical advice. Please consult your doctor for medical decisions.
            </p>
          </div>
        </div>

        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1" id="chat-history-list">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-2">
            Recent Chats
          </div>
          {messages.length === 0 ? (
            <p className="text-xs text-slate-400 px-2 py-4 text-center">No chat history yet</p>
          ) : (
            messages
              .filter(m => m.role === 'user')
              .slice(-20)
              .map((msg, idx) => (
                <div
                  key={msg.id + '-' + idx}
                  className="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                  id={`history-item-${idx}`}
                >
                  <p className="text-xs font-medium text-slate-700 truncate">{msg.content}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(msg.timestamp)} at {formatTime(msg.timestamp)}</p>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          id="sidebar-overlay"
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0" id="ai-chat-main">
        
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer"
              id="toggle-sidebar-btn"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white flex items-center justify-center shadow-sm">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                MediRemind AI Assistant
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  <CheckCircle className="w-3 h-3" />
                  Online
                </span>
              </h1>
              <p className="text-[11px] text-slate-500">Always here to help with your medication reminders</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowClearConfirm(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              id="clear-chat-header-btn"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6"
          id="ai-chat-messages"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              id={`message-${message.id}`}
            >
              {/* Avatar */}
              <div
                className={`
                  flex-shrink-0 h-8 w-8 rounded-xl flex items-center justify-center
                  ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-blue-600 to-emerald-500 text-white'}
                `}
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
                  max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm
                  ${message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                  }
                `}
              >
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`
                    text-[10px] mt-1.5 flex items-center gap-1
                    ${message.role === 'user' ? 'text-blue-100' : 'text-slate-400'}
                  `}
                >
                  <Clock className="w-3 h-3" />
                  {formatTime(message.timestamp)}
                </div>

                {/* Suggested Actions */}
                {message.suggestedActions && message.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Suggested</p>
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestedActions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestedAction(action)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors cursor-pointer border border-blue-100"
                          id={`suggested-action-${idx}`}
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
            <div className="flex gap-3" id="typing-indicator">
              <div className="flex-shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts (when no messages or empty state) */}
        {messages.length <= 1 && !isTyping && (
          <div className="px-4 pb-4" id="suggested-prompts">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Quick Actions
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedAction(prompt)}
                    className="text-left px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 text-xs font-medium text-slate-700 hover:text-blue-700 transition-all cursor-pointer"
                    id={`quick-prompt-${idx}`}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-slate-200 px-4 py-3" id="ai-chat-input-area">
          <form onSubmit={handleSend} className="flex items-end gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your medicines, reminders, or caretaker..."
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                id="ai-chat-input"
                disabled={isTyping}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                id="voice-input-btn"
                title="Voice input (coming soon)"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white shadow-sm hover:shadow transition-all cursor-pointer disabled:cursor-not-allowed flex-shrink-0"
              id="send-message-btn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-2 text-center">
            AI responses are based on your stored medication data. Not medical advice.
          </p>
        </div>
      </div>

      {/* Clear Chat Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" id="clear-chat-modal">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">Clear Chat History?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                id="cancel-clear-btn"
              >
                Cancel
              </button>
              <button
                onClick={handleClearChat}
                className="flex-1 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors cursor-pointer"
                id="confirm-clear-btn"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
