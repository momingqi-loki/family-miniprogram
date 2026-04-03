# 家庭管理小程序

> 一款用于家庭成员共享管理未来的规划和日常事务的小程序

---

## 📋 项目简介

家庭管理小程序是一个家庭共享管理工具，支持所有家庭成员访问和操作，方便家庭内部的协作和沟通。

### 核心功能

- **计划规划**：家庭旅游 + 重要节日和纪念日
- **任务管理**：家庭杂务（缴费、物业、车辆保养等）
- **日程安排**：查看和管理家庭日程 + 冲突检测

---

## 🏗️ 项目结构

```
family-miniprogram/
├── miniprogram/              # 小程序前端代码
│   ├── pages/               # 页面
│   │   ├── index/          # 首页
│   │   ├── plan/           # 计划规划
│   │   ├── task/           # 任务管理
│   │   ├── schedule/       # 日程安排
│   │   └── settings/       # 设置
│   ├── components/         # 组件
│   ├── utils/             # 工具函数
│   ├── app.json           # 小程序配置
│   ├── app.js             # 小程序逻辑
│   └── app.wxss           # 小程序样式
│
├── server/                 # 后端代码（Node.js + Express）
│   ├── config/            # 配置文件
│   ├── models/            # 数据模型
│   ├── routes/            # 路由
│   ├── middleware/        # 中间件
│   ├── app.js             # 应用入口
│   └── package.json       # 依赖管理
│
└── docs/                  # 文档
```

---

## 🚀 快速开始

### 前置要求

- Node.js 14+
- MongoDB 4.4+
- 微信开发者工具
- 微信小程序账号

### 后端启动

1. 进入后端目录
```bash
cd server
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env` 文件：
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/family-miniprogram
JWT_SECRET=your-secret-key
```

4. 启动服务
```bash
npm run dev
```

服务将在 `http://localhost:3000` 启动

### 小程序启动

1. 用微信开发者工具打开 `miniprogram` 目录
2. 修改 `utils/request.js` 中的 `BASE_URL` 为实际后端地址
3. 点击编译运行

---

## 📊 数据库设计

### 用户表（users）
- id: 用户ID
- openid: 微信openid
- nickname: 昵称
- avatar: 头像URL
- role: 角色（admin/member）
- familyId: 家庭ID
- online: 在线状态
- lastLoginAt: 最后登录时间
- createdAt: 创建时间

### 任务表（tasks）
- id: 任务ID
- familyId: 家庭ID
- title: 任务名称
- type: 任务类型（bill/vehicle/household/other）
- assignee: 负责人
- status: 状态（todo/inprogress/completed）
- deadline: 截止时间
- remindTime: 提醒时间
- remark: 备注
- createdBy: 创建人
- createdAt: 创建时间
- completedAt: 完成时间

### 日程表（events）
- id: 日程ID
- familyId: 家庭ID
- title: 日程名称
- startTime: 开始时间
- endTime: 结束时间
- repeatType: 重复类型（none/weekly/monthly/yearly）
- participants: 参与人
- location: 地点
- remindTime: 提醒时间
- remark: 备注
- createdBy: 创建人
- createdAt: 创建时间

---

## 🔌 API 接口

### 用户接口
- POST `/api/user/login` - 微信登录
- GET `/api/user/profile` - 获取用户信息
- PUT `/api/user/profile` - 更新用户信息
- PUT `/api/user/online` - 更新在线状态

### 任务接口
- GET `/api/tasks/today` - 获取今日任务
- POST `/api/tasks` - 创建任务
- PUT `/api/tasks/:id/status` - 更新任务状态
- DELETE `/api/tasks/:id` - 删除任务

### 日程接口
- GET `/api/events/today` - 获取今日日程
- POST `/api/events` - 创建日程
- GET `/api/events/calendar` - 获取日历视图
- PUT `/api/events/:id` - 更新日程
- DELETE `/api/events/:id` - 删除日程

### 家庭接口
- GET `/api/family/members` - 获取家庭成员
- POST `/api/family` - 创建家庭
- POST `/api/family/join` - 加入家庭

---

## 🎨 技术栈

### 前端
- **框架**：微信小程序原生框架
- **UI组件**：Vant Weapp（可选）
- **状态管理**：小程序原生
- **数据请求**：wx.request

### 后端
- **框架**：Express.js
- **数据库**：MongoDB + Mongoose
- **认证**：JWT
- **跨域**：CORS

---

## 📅 开发计划

### 第一阶段（MVP）- 2周
- [x] 需求设计
- [x] 技术选型
- [x] 数据库设计
- [x] API 接口设计
- [x] 前端框架搭建
- [x] 后端框架搭建
- [ ] 用户注册登录
- [ ] 家庭管理
- [ ] 计划规划模块（旅游）
- [ ] 计划规划模块（节日）
- [ ] 任务管理模块

### 第二阶段（完善功能）- 2周
- [ ] 日程安排模块
- [ ] 冲突检测功能
- [ ] 通知推送功能
- [ ] 测试和优化

### 第三阶段（上线发布）- 1周
- [ ] 代码审查
- [ ] 性能优化
- [ ] 用户体验优化
- [ ] 提交审核
- [ ] 正式发布

---

## ✅ 当前状态

**已完成：**
- ✅ 需求文档
- ✅ 项目结构搭建
- ✅ 数据库模型定义
- ✅ 核心API接口实现
- ✅ 前端页面框架
- ✅ 网络请求工具
- ✅ 首页（完整）
- ✅ 计划规划模块（旅游：列表、创建、详情）
- ✅ 计划规划模块（节日：列表、创建）
- ✅ 任务管理模块（列表）
- ✅ 日程安排模块（列表）
- ✅ 设置模块（首页）

**待完成：**
- ⏳ 任务管理模块（创建、详情页）
- ⏳ 日程安排模块（创建、详情页）
- ⏳ 节日管理模块（详情页）
- ⏳ 冲突检测完善
- ⏳ 通知推送功能
- ⏳ 日历组件集成
- ⏳ 微信登录完善
- ⏳ 测试和优化

---

## 👨‍👩‍👧 用户场景

### 场景1：临时起意去旅游
1. 起心动念：想去古北水镇玩
2. 家庭讨论：晚上吃饭时和家人商量
3. 查看日程：发现这周末大家都空闲
4. 查看天气：周末天气晴朗
5. 预订酒店：订好两晚住宿
6. 出行：周六早上出发
7. 记录美好：上传照片到小程序

### 场景2：管理家庭杂务
1. 爸爸创建任务：4月电费
2. 分配任务：分配给自己
3. 提醒设置：提前3天提醒
4. 完成任务：缴费后标记完成
5. 历史记录：查看历史缴费记录

### 场景3：安排家庭日程
1. 妈妈创建日程：周五晚上家庭聚餐
2. 设置时间：18:00-19:30
3. 选择参与人：爸爸、妈妈、孩子
4. 冲突检测：检查是否有冲突
5. 提醒设置：提前1小时提醒
6. 完成：大家都收到提醒

---

## 📝 注意事项

1. **开发环境**：当前使用 localhost，上线时需修改为实际域名
2. **微信登录**：需要配置微信小程序AppID和AppSecret
3. **数据库**：确保MongoDB服务已启动
4. **token过期**：token有效期为30天，过期后需重新登录

---

## 📞 联系方式

- 负责人：莫铭棋
- 创建日期：2026-04-03

---

*持续更新中...*
