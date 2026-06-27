# 拓图 TuTu 项目

把城市生活变成开放世界冒险

## 快速启动指南

### 一键启动（推荐）

```bash
# 在项目根目录执行
bash start.sh
```

脚本会自动启动 MySQL、后端、前端，并显示访问地址。

```bash
# 一键停止所有服务
bash stop.sh
```

### 手动启动（逐个启动）

#### 1. 启动数据库
```bash
# 启动MySQL服务
mysqld_safe --datadir=/opt/homebrew/var/mysql &

# 验证数据库（可选）
mysql -u root -proot123 -e "USE tutu_db; SHOW TABLES;"
```

#### 2. 启动后端
```bash
cd tutu-backend

# 如果未编译，先编译
mvn clean package -DskipTests

# 启动Spring Boot应用
java -jar target/tutu-backend-1.0.0.jar
```

后端服务地址：http://localhost:8080

#### 3. 启动前端
```bash
cd tutu-app

# 如果未安装依赖，先安装
npm install

# 启动开发服务器
npm run dev
```

前端访问地址：http://localhost:5173

#### 4. 访问应用
打开浏览器访问 http://localhost:5173，即可使用拓图应用。

测试账号：`test@tutu.com` / 密码 `123456`

## 项目结构

```
tutu/
├── tutu-app/          # 前端项目（React + TypeScript + Tailwind CSS）
├── tutu-backend/      # 后端项目（Java + Spring Boot）
└── tutu-backend/scripts/  # 数据库脚本
```

## 前端项目 (tutu-app)

### 技术栈
- React 18 + TypeScript
- Tailwind CSS（游戏化暗黑主题）
- Zustand（状态管理）
- Framer Motion（动画效果）

### 主要功能模块

#### 1. 城市探索地图
- 精细的北京市地图，包含16个行政区轮廓
- 43个打卡点（景点、美食、文化、个人地标）
- 支持缩放和拖动
- 分类筛选（景点/美食/文化/个人）
- 打卡获得XP奖励

#### 2. 任务中心
- 日历形式展示
- 任务分类（工作/健身/学习/生活）
- 不同颜色区分任务类型
- 支持自定义任务
- 任务状态流转（可领取→进行中→已完成）
- XP奖励系统

#### 3. 城市论坛
- 话题分类
- 帖子列表
- 点赞功能
- 发帖互动

#### 4. 个人中心
- **我的家园**：家和公司位置管理
- **等级成长**：等级展示、能力面板
- **成就系统**：成就解锁、进度显示
- **排行榜**：玩家排名
- **记账本**：经济系统（收支管理）
- **设置**：个人信息配置

#### 5. 经济系统（记账功能）
- 收入支出记录
- 月度维度统计
- 分类统计展示
- 结余计算
- 数据可视化

### 运行前端

```bash
cd tutu-app
npm install
npm run dev
```

访问：http://localhost:5173/

## 数据库配置

### 安装MySQL（macOS）

```bash
# 使用Homebrew安装MySQL
brew install mysql

# 初始化数据库
mysqld --initialize --datadir=/opt/homebrew/var/mysql

# 启动MySQL服务
mysqld_safe --datadir=/opt/homebrew/var/mysql &

# 修改root密码（使用初始化时生成的临时密码）
mysql -u root -p'<临时密码>' --connect-expired-password -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'root123';"

# 导入数据库初始化脚本
mysql -u root -proot123 < tutu-backend/scripts/init-database.sql
```

### 数据库连接信息
- 数据库：`tutu_db`
- 用户名：`root`
- 密码：`root123`
- 端口：`3306`

### 数据表
- `users` - 用户表
- `spots` - 地点表
- `quests` - 任务表
- `achievements` - 成就表
- `user_spots` - 用户打卡记录
- `user_achievements` - 用户成就
- `forum_posts` - 论坛帖子
- `post_likes` - 帖子点赞
- `accounts` - 账户表

## 后端项目 (tutu-backend)

### 技术栈
- Java 17
- Spring Boot 3.2.2
- Spring Data JPA
- Spring Security + JWT
- MySQL
- Lombok
- Maven

### API端点

#### 用户数据
- `GET /api/user` - 获取用户数据
- `PUT /api/user` - 更新用户数据

#### 地点数据
- `GET /api/spots` - 获取所有地点
- `POST /api/spots/{id}/visit` - 访问地点

#### 任务数据
- `GET /api/quests` - 获取所有任务
- `POST /api/quests` - 创建新任务
- `PUT /api/quests/{id}/status` - 更新任务状态

#### 账目数据
- `GET /api/accounts` - 获取所有账目
- `POST /api/accounts` - 创建新账目
- `GET /api/accounts/stats` - 获取账目统计（支持月度查询）

#### 认证接口
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册

### 运行后端

```bash
cd tutu-backend

# 编译项目
mvn clean package -DskipTests

# 运行项目
java -jar target/tutu-backend-1.0.0.jar
```

后端服务运行在：http://localhost:8080/

## 项目特色

### 1. 游戏化设计
- 暗黑主题配色
- XP经验值系统
- 等级成长机制
- 成就解锁系统
- 流畅的动画效果

### 2. 北京市地图
- 16个行政区详细轮廓
- 山脉、河流等地理元素
- 43个精选打卡点
- 地标建筑展示
- 游戏风格视觉设计

### 3. 完整的任务系统
- 日历式任务管理
- 多任务类别支持
- 自定义任务功能
- XP奖励机制
- 任务进度追踪

### 4. 经济管理系统
- 完整的记账功能
- 月度统计分析
- 分类统计
- 收入支出追踪
- 结余计算

## 后续优化方向

1. **前端API对接**
   - 将前端数据改为从后端API获取
   - 实现数据的持久化

2. **用户认证完善**
   - 完善JWT身份验证流程
   - 实现用户权限管理

3. **数据可视化**
   - 记账数据图表展示
   - 任务完成统计图表
   - 探索进度可视化

4. **更多城市**
   - 支持更多城市地图
   - 城市切换功能

5. **性能优化**
   - API响应缓存
   - 地图渲染优化
   - 数据库查询优化

## 技术亮点

- **前后端分离架构**
- **响应式设计**（适配移动端和桌面端）
- **流畅动画**（使用Framer Motion）
- **状态管理**（使用Zustand轻量级方案）
- **类型安全**（TypeScript完整类型定义）
- **游戏化UI**（独特的暗黑主题设计）

## 作者

拓图项目团队

## 许可证

MIT