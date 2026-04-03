# 家庭管理小程序 - 项目文件清单

> 创建时间：2026-04-03
> 状态：核心模块开发完成

---

## 📊 项目统计

| 类别 | 文件数 | 行数（估计） |
|------|--------|--------------|
| 前端页面 | 15个 | ~5000行 |
| 后端代码 | 12个 | ~3500行 |
| 配置文件 | 2个 | ~100行 |
| 文档 | 3个 | ~3000行 |
| **总计** | **32个** | **~11600行** |

---

## 📁 前端文件清单（miniprogram/）

### 配置文件
- app.json - 小程序配置（页面路由、tabBar、样式）
- app.js - 小程序入口文件
- app.wxss - 全局样式（未创建，可按需添加）

### 页面文件（pages/）

#### 1. 首页（pages/index/）
- index.js - 首页逻辑
- index.wxml - 首页模板
- index.wxss - 首页样式

#### 2. 计划规划（pages/plan/）
- index.js - 计划规划列表页逻辑
- index.wxml - 计划规划列表页模板
- index.wxss - 计划规划列表页样式
- trip-create.js - 旅游创建页逻辑
- trip-create.wxml - 旅游创建页模板
- trip-create.wxss - 旅游创建页样式
- trip-detail.js - 旅游详情页逻辑
- trip-detail.wxml - 旅游详情页模板
- holiday-create.js - 节日创建页逻辑
- holiday-create.wxml - 节日创建页模板

#### 3. 任务管理（pages/task/）
- index.js - 任务列表页逻辑
- index.wxml - 任务列表页模板
- index.wxss - 任务列表页样式

#### 4. 日程安排（pages/schedule/）
- index.js - 日程列表页逻辑
- index.wxml - 日程列表页模板
- index.wxss - 日程列表页样式

#### 5. 设置（pages/settings/）
- index.js - 设置页逻辑
- index.wxml - 设置页模板
- index.wxss - 设置页样式

### 工具文件（utils/）
- request.js - 网络请求工具（封装token、错误处理）

---

## 🔧 后端文件清单（server/）

### 应用文件
- app.js - Express应用入口
- package.json - 依赖管理

### 数据模型（models/）
- user.js - 用户模型
- family.js - 家庭模型
- trip.js - 旅游模型
- holiday.js - 节日模型
- task.js - 任务模型
- event.js - 日程模型

### 路由文件（routes/）
- user.js - 用户路由（登录、信息管理）
- family.js - 家庭路由（创建、加入、成员管理）
- trip.js - 旅游路由（CRUD）
- holiday.js - 节日路由（CRUD）
- task.js - 任务路由（CRUD、状态更新）
- event.js - 日程路由（CRUD、冲突检测）

### 中间件（middleware/）
- auth.js - JWT认证中间件

---

## 📚 文档文件清单

- README.md - 项目说明、快速开始、API文档
- family-miniprogram-requirements.md - 需求文档（完整）
- PROJECT-FILES.md - 本文件（项目文件清单）

---

## 🎯 功能完成度

| 模块 | 功能 | 状态 | 完成度 |
|------|------|------|--------|
| 用户管理 | 登录、信息管理 | 🟡 部分完成 | 60% |
| 家庭管理 | 创建家庭、成员管理 | 🟡 部分完成 | 50% |
| 计划规划 | 旅游列表、创建、详情 | ✅ 完成 | 80% |
| 计划规划 | 节日列表、创建 | ✅ 完成 | 60% |
| 任务管理 | 任务列表、状态更新 | 🟡 部分完成 | 50% |
| 任务管理 | 任务创建、详情 | ⏳ 未完成 | 0% |
| 日程安排 | 日程列表、月视图 | 🟡 部分完成 | 40% |
| 日程安排 | 日程创建、详情、冲突检测 | ⏳ 未完成 | 0% |
| 设置 | 用户信息、家庭信息 | 🟡 部分完成 | 50% |

---

## 🚀 快速开始

### 1. 克隆/复制项目
```bash
# 将所有文件复制到本地
family-miniprogram/
├── miniprogram/
└── server/
```

### 2. 启动后端
```bash
cd server
npm install
npm run dev
```

### 3. 启动小程序
1. 打开微信开发者工具
2. 选择 `miniprogram` 目录
3. 点击编译运行

### 4. 测试功能
- 首页：查看今日待办和日程
- 计划规划：创建旅游、节日
- 任务管理：查看任务列表
- 日程安排：查看日程列表
- 设置：查看个人信息

---

## ⚠️ 注意事项

### 1. 未完成的功能
- 任务创建页
- 任务详情页
- 日程创建页
- 日程详情页
- 节日详情页
- 微信登录集成
- 日历组件集成
- 通知推送

### 2. 待配置项
- 微信小程序AppID和AppSecret
- 后端BASE_URL（修改utils/request.js）
- MongoDB连接字符串
- JWT密钥

### 3. 数据库
需要创建MongoDB数据库和索引：
```javascript
// 用户索引
db.users.createIndex({ openid: 1 }, { unique: true })

// 旅游索引
db.trips.createIndex({ familyId: 1 })
db.trips.createIndex({ startDate: 1 })

// 节日索引
db.holidays.createIndex({ familyId: 1 })
db.holidays.createIndex({ date: 1 })

// 任务索引
db.tasks.createIndex({ familyId: 1 })
db.tasks.createIndex({ status: 1 })
db.tasks.createIndex({ deadline: 1 })

// 日程索引
db.events.createIndex({ familyId: 1 })
db.events.createIndex({ startTime: 1 })
db.events.createIndex({ endTime: 1 })
```

---

## 📝 下一步开发建议

### 优先级1：完善核心功能
1. 完成任务创建和详情页
2. 完成日程创建和详情页
3. 完成节日详情页

### 优先级2：集成第三方服务
1. 微信登录
2. 微信支付（可选）
3. 微信模板消息（通知推送）
4. 腾讯地图API

### 优先级3：优化和测试
1. 性能优化
2. 用户体验优化
3. 错误处理完善
4. 单元测试

---

## 📞 技术支持

如有问题，请联系：
- 负责人：莫铭棋
- 创建日期：2026-04-03

---

*持续更新中...*
