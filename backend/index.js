import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tinhRoutes from './routes/tinhRoutes.js';
import tramRoutes from './routes/tramRoutes.js';
import cotRoutes from './routes/cotRoutes.js';
import volumeOtherRoutes from './routes/volumeOtherRoutes.js';
import hopdongRoutes from './routes/hopdongRoutes.js';
import hopdongCotRoutes from './routes/hopdongCotRoutes.js';
import hopdongVolumeOtherRoutes from './routes/hopdongVolumeOtherRoutes.js';
import thucteRoutes from './routes/thucteRoutes.js';
import tiendoRoutes from './routes/tiendoRoutes.js';
import lichsuRoutes from './routes/lichsuRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import exportRoutes from './routes/exportRoutes.js';
import importRoutes from './routes/importRoutes.js';
import phancongKhaosatRoutes from './routes/phancongKhaosatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('Kết nối database thành công');
    connection.release();
  })
  .catch(error => {
    console.error('Lỗi kết nối database:', error);
  });

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/tinh', tinhRoutes);
app.use('/tram', tramRoutes);
app.use('/cot', cotRoutes);
app.use('/volume-other', volumeOtherRoutes);
app.use('/hopdong', hopdongRoutes);
app.use('/hopdong', hopdongCotRoutes);
app.use('/hopdong', hopdongVolumeOtherRoutes);
app.use('/hopdong', thucteRoutes);
app.use('/hopdong', tiendoRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/export', exportRoutes);
app.use('/import', importRoutes);
app.use('/lichsu', lichsuRoutes);
app.use('/phancong-khaosat', phancongKhaosatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server đang chạy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Lỗi:', err);
  res.status(500).json({ error: 'Lỗi server', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Không tìm thấy endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

