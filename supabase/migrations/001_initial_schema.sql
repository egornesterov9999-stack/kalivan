-- Profiles table (автоматически создается Supabase)
-- Но добавим необходимые поля

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username VARCHAR(255) UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Servers table
CREATE TABLE IF NOT EXISTS public.servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url TEXT,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  members UUID[] DEFAULT ARRAY[]::UUID[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Channels table
CREATE TABLE IF NOT EXISTS public.channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id UUID NOT NULL REFERENCES public.servers(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) DEFAULT 'text', -- 'text' or 'voice'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID NOT NULL REFERENCES public.channels(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  edited_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Direct Messages table
CREATE TABLE IF NOT EXISTS public.direct_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_servers_owner ON public.servers(owner_id);
CREATE INDEX IF NOT EXISTS idx_channels_server ON public.channels(server_id);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON public.messages(channel_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON public.messages(created_at);
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender ON public.direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient ON public.direct_messages(recipient_id);

-- Row Level Security (RLS)

-- Profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Servers RLS
ALTER TABLE public.servers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view servers they own or are member of" ON public.servers
  FOR SELECT USING (
    auth.uid() = owner_id OR auth.uid() = ANY(members)
  );

CREATE POLICY "Users can create servers" ON public.servers
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Only server owner can update" ON public.servers
  FOR UPDATE USING (auth.uid() = owner_id);

-- Channels RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view channels in their servers" ON public.channels
  FOR SELECT USING (
    server_id IN (
      SELECT id FROM public.servers 
      WHERE auth.uid() = owner_id OR auth.uid() = ANY(members)
    )
  );

CREATE POLICY "Only server owner can create channels" ON public.channels
  FOR INSERT WITH CHECK (
    server_id IN (
      SELECT id FROM public.servers 
      WHERE auth.uid() = owner_id
    )
  );

-- Messages RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their channels" ON public.messages
  FOR SELECT USING (
    channel_id IN (
      SELECT id FROM public.channels 
      WHERE server_id IN (
        SELECT id FROM public.servers 
        WHERE auth.uid() = owner_id OR auth.uid() = ANY(members)
      )
    )
  );

CREATE POLICY "Users can insert messages in their channels" ON public.messages
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    channel_id IN (
      SELECT id FROM public.channels 
      WHERE server_id IN (
        SELECT id FROM public.servers 
        WHERE auth.uid() = owner_id OR auth.uid() = ANY(members)
      )
    )
  );

-- Direct Messages RLS
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their direct messages" ON public.direct_messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = recipient_id
  );

CREATE POLICY "Users can send direct messages" ON public.direct_messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
