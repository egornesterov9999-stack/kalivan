import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface Channel {
  id: string;
  server_id: string;
  name: string;
  type: 'text' | 'voice';
  created_at: string;
}

interface Server {
  id: string;
  name: string;
  icon_url?: string;
  owner_id: string;
  created_at: string;
}

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

interface ChatStore {
  servers: Server[];
  channels: Channel[];
  messages: Message[];
  currentServer: string | null;
  currentChannel: string | null;
  loading: boolean;
  
  fetchServers: (userId: string) => Promise<void>;
  fetchChannels: (serverId: string) => Promise<void>;
  fetchMessages: (channelId: string) => Promise<void>;
  createServer: (name: string, userId: string) => Promise<string>;
  createChannel: (serverId: string, name: string, type: 'text' | 'voice') => Promise<string>;
  sendMessage: (channelId: string, userId: string, content: string) => Promise<void>;
  setCurrentServer: (serverId: string) => void;
  setCurrentChannel: (channelId: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  servers: [],
  channels: [],
  messages: [],
  currentServer: null,
  currentChannel: null,
  loading: false,

  fetchServers: async (userId: string) => {
    try {
      set({ loading: true });
      const { data } = await supabase
        .from('servers')
        .select('*')
        .or(`owner_id.eq.${userId},members.contains([${userId}])`);

      set({ servers: data || [] });
    } catch (error) {
      console.error('Error fetching servers:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchChannels: async (serverId: string) => {
    try {
      set({ loading: true });
      const { data } = await supabase
        .from('channels')
        .select('*')
        .eq('server_id', serverId)
        .order('created_at', { ascending: true });

      set({ channels: data || [] });
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      set({ loading: false });
    }
  },

  fetchMessages: async (channelId: string) => {
    try {
      set({ loading: true });
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          user:user_id(id, username, avatar_url)
        `)
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true });

      set({ messages: data || [] });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      set({ loading: false });
    }
  },

  createServer: async (name: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('servers')
        .insert({
          name,
          owner_id: userId,
          members: [userId],
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ servers: [...state.servers, data] }));
      return data.id;
    } catch (error) {
      console.error('Error creating server:', error);
      throw error;
    }
  },

  createChannel: async (serverId: string, name: string, type: 'text' | 'voice' = 'text') => {
    try {
      const { data, error } = await supabase
        .from('channels')
        .insert({
          server_id: serverId,
          name,
          type,
        })
        .select()
        .single();

      if (error) throw error;

      set((state) => ({ channels: [...state.channels, data] }));
      return data.id;
    } catch (error) {
      console.error('Error creating channel:', error);
      throw error;
    }
  },

  sendMessage: async (channelId: string, userId: string, content: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          channel_id: channelId,
          user_id: userId,
          content,
        })
        .select(`
          *,
          user:user_id(id, username, avatar_url)
        `)
        .single();

      if (error) throw error;

      set((state) => ({ messages: [...state.messages, data] }));
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  setCurrentServer: (serverId: string) => {
    set({ currentServer: serverId });
  },

  setCurrentChannel: (channelId: string) => {
    set({ currentChannel: channelId });
  },
}));
