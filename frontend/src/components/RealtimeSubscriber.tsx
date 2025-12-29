import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useChatStore } from '../store/chat';

interface RealtimeSubscriberProps {
  channelId: string;
}

export default function RealtimeSubscriber({ channelId }: RealtimeSubscriberProps) {
  useEffect(() => {
    if (!channelId) return;

    const subscription = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `channel_id=eq.${channelId}`,
        },
        (payload: any) => {
          // Refresh messages when new message is inserted
          useChatStore.getState().fetchMessages(channelId);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [channelId]);

  return null;
}
