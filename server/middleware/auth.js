const jwt = require('jsonwebtoken');
const User = require('../models/user');

// 认证中间件
const authMiddleware = async (req, res, next) => {
  try {
    // 从请求头获取token
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        code: 401,
        message: '未提供认证token'
      });
    }

    // 验证token
    const decoded = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.JWT_SECRET || 'your-secret-key'
    );

    // 查找用户
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在'
      });
    }

    // 将用户信息附加到请求对象
    req.user = user;
    req.userId = user._id;
    req.familyId = user.familyId;

    next();
  } catch (error) {
    console.error('认证失败', error);
    res.status(401).json({
      code: 401,
      message: '认证失败',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
