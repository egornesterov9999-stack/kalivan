import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Load env variables before dynamically importing modules that depend on them
dotenv.config();

(async () => {
  const authRoutesModule = await import('./routes/auth.js');
  const chatRoutesModule = await import('./routes/chat.js');
  const authMiddleware = await import('./middleware/auth.js');

  const authRoutes = authRoutesModule.default;
  const chatRoutes = chatRoutesModule.default;
  const verifyToken = authMiddleware.verifyToken;

  const app: Express = express();
  const httpServer = createServer(app);
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/chat', verifyToken, chatRoutes);

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // WebSocket
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_channel', (channelId: string) => {
      socket.join(`channel_${channelId}`);
      console.log(`User joined channel: ${channelId}`);
    });

    socket.on('leave_channel', (channelId: string) => {
      socket.leave(`channel_${channelId}`);
    });

    socket.on('send_message', (data: { channelId: string; message: string; userId: string }) => {
      io.to(`channel_${data.channelId}`).emit('new_message', {
        ...data,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  // Error handling
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  });

  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
})();
