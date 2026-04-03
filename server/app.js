const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// 路由
const userRoutes = require('./routes/user');
const familyRoutes = require('./routes/family');
const tripRoutes = require('./routes/trip');
const holidayRoutes = require('./routes/holiday');
const taskRoutes = require('./routes/task');
const eventRoutes = require('./routes/event');

// 中间件
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/family-miniprogram', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB连接成功');
}).catch(err => {
  console.error('MongoDB连接失败', err);
});

// API 路由
app.use('/api/user', userRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/trips', authMiddleware, tripRoutes);
app.use('/api/holidays', authMiddleware, holidayRoutes);
app.use('/api/tasks', authMiddleware, taskRoutes);
app.use('/api/events', authMiddleware, eventRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app;
