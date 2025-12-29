import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_KEY || ''
);

// Get servers for user
router.get('/servers', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const { data, error } = await supabase
      .from('servers')
      .select('*')
      .or(`owner_id.eq.${userId},members.contains([${userId}])`);

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create server
router.post('/servers', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Server name is required' });
    }

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

    // Create default channels
    await supabase.from('channels').insert([
      { server_id: data.id, name: 'general', type: 'text' },
      { server_id: data.id, name: 'announcements', type: 'text' },
      { server_id: data.id, name: 'general-voice', type: 'voice' },
    ]);

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get channels for server
router.get('/servers/:serverId/channels', async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;

    const { data, error } = await supabase
      .from('channels')
      .select('*')
      .eq('server_id', serverId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create channel
router.post('/servers/:serverId/channels', async (req: Request, res: Response) => {
  try {
    const { serverId } = req.params;
    const { name, type = 'text' } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Channel name is required' });
    }

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

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for channel
router.get('/channels/:channelId/messages', async (req: Request, res: Response) => {
  try {
    const { channelId } = req.params;

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        user:user_id(id, username, avatar_url)
      `)
      .eq('channel_id', channelId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    res.json(data || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Send message
router.post('/channels/:channelId/messages', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { channelId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

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

    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
