import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/auth';
import { useChatStore } from '../store/chat';
import { FiPlus, FiLogOut, FiSettings, FiHash, FiVolume2 } from 'react-icons/fi';
import ChatWindow from '../components/ChatWindow';
import ServerModal from '../components/ServerModal';

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const { servers, channels, currentServer, fetchServers, fetchChannels } = useChatStore();
  const [showServerModal, setShowServerModal] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchServers(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (currentServer) {
      fetchChannels(currentServer);
    }
  }, [currentServer]);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Server Sidebar */}
      <div className="w-20 bg-gray-800 flex flex-col items-center py-4 gap-3 border-r border-gray-700">
        {/* Logo */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-pointer hover:rounded-lg transition-all duration-200">
          <span className="text-xl font-bold">K</span>
        </div>

        {/* Servers */}
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
          {servers.map((server) => (
            <div
              key={server.id}
              onClick={() => {
                useChatStore.setState({ currentServer: server.id });
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${
                currentServer === server.id
                  ? 'bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title={server.name}
            >
              {server.icon_url ? (
                <img src={server.icon_url} alt={server.name} className="w-full h-full rounded-full" />
              ) : (
                <span className="text-sm font-bold">{server.name[0]}</span>
              )}
            </div>
          ))}
        </div>

        {/* Add Server Button */}
        <button
          onClick={() => setShowServerModal(true)}
          className="w-12 h-12 rounded-full bg-gray-700 hover:bg-green-600 flex items-center justify-center transition-all duration-200 text-green-400"
          title="Создать сервер"
        >
          <FiPlus size={24} />
        </button>

        {/* Settings & Logout */}
        <div className="flex flex-col gap-2 border-t border-gray-700 pt-3">
          <button className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-all duration-200">
            <FiSettings size={20} />
          </button>
          <button
            onClick={handleLogout}
            className="w-12 h-12 rounded-full bg-gray-700 hover:bg-red-600 flex items-center justify-center transition-all duration-200 text-red-400"
            title="Выход"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Channels Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Server Header */}
          {currentServer && (
            <div className="h-14 px-4 border-b border-gray-700 flex items-center justify-between hover:bg-gray-700/50 cursor-pointer">
              <h2 className="font-bold text-white">
                {servers.find((s) => s.id === currentServer)?.name || 'Server'}
              </h2>
              <button className="text-gray-400 hover:text-white">
                <span>▼</span>
              </button>
            </div>
          )}

          {/* Channels List */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-2 py-3">
              <h3 className="px-2 py-1 text-xs font-bold text-gray-400 uppercase">Каналы</h3>
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => {
                    useChatStore.setState({ currentChannel: channel.id });
                    setSelectedChannel(channel.id);
                  }}
                  className={`px-2 py-2 rounded cursor-pointer transition-all ${
                    selectedChannel === channel.id
                      ? 'bg-gray-700/70 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {channel.type === 'voice' ? (
                      <FiVolume2 size={16} />
                    ) : (
                      <FiHash size={16} />
                    )}
                    <span className="text-sm font-medium">{channel.name}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Channel Button */}
            {currentServer && (
              <button className="w-full mx-auto px-2 py-2 text-gray-400 hover:text-white hover:bg-gray-700/40 rounded text-sm flex items-center gap-2 justify-center">
                <FiPlus size={16} />
                <span>Канал</span>
              </button>
            )}
          </div>

          {/* User Profile */}
          {user && (
            <div className="h-14 px-3 border-t border-gray-700 flex items-center gap-3 bg-gray-700/30 hover:bg-gray-700/50 cursor-pointer">
              <img
                src={user.avatar_url}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.username}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Chat Window */}
        {selectedChannel ? (
          <ChatWindow channelId={selectedChannel} />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-400 mb-2">Выберите канал</h2>
              <p className="text-gray-500">Начните общение с товарищами</p>
            </div>
          </div>
        )}
      </div>

      {/* Server Modal */}
      {showServerModal && (
        <ServerModal
          onClose={() => setShowServerModal(false)}
          userId={user?.id || ''}
        />
      )}
    </div>
  );
}
