import React, { useEffect, useRef } from 'react';
import { useChatStore } from '../store/chat';
import { useAuthStore } from '../store/auth';
import { FiSend } from 'react-icons/fi';
import MessageItem from './MessageItem';
import RealtimeSubscriber from './RealtimeSubscriber';

interface ChatWindowProps {
  channelId: string;
}

export default function ChatWindow({ channelId }: ChatWindowProps) {
  const { user } = useAuthStore();
  const { messages, fetchMessages, sendMessage } = useChatStore();
  const [inputValue, setInputValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages(channelId);
  }, [channelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user) return;

    setLoading(true);
    try {
      await sendMessage(channelId, user.id, inputValue.trim());
      setInputValue('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-900">
      <RealtimeSubscriber channelId={channelId} />
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Нет сообщений. Начните диалог!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700 p-4 bg-gray-900/50">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Напишите сообщение..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:bg-gray-700/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <FiSend size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
