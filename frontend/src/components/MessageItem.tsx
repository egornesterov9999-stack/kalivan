import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Message {
  id: string;
  channel_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const timeAgo = formatDistanceToNow(new Date(message.created_at), {
    locale: ru,
    addSuffix: true,
  });

  return (
    <div className="flex gap-3 hover:bg-gray-800/30 rounded p-2 transition-colors group">
      <img
        src={message.user.avatar_url}
        alt={message.user.username}
        className="w-10 h-10 rounded-full flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-white">{message.user.username}</span>
          <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {timeAgo}
          </span>
        </div>
        <p className="text-gray-100 break-words">{message.content}</p>
      </div>
    </div>
  );
}
