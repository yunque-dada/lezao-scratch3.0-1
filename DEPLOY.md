# Railway 部署指南

## 架构说明

本项目使用前后端分离架构：
- **后端服务**: Node.js + Express + MongoDB (端口 3000)
- **前端服务**: React + Vite (端口 $PORT，默认 5173)

## Railway 部署步骤

### 步骤1：创建 Railway 项目

1. 登录 [Railway](https://railway.app)
2. 创建新项目，选择 "Empty Project"
3. 添加 MySQL 数据库插件（或者 MongoDB 插件）

### 步骤2：添加服务

#### 2.1 后端服务
1. 点击 "New" → "GitHub Repo"
2. 选择 `yunque-dada/lezao-scratch3.0-1` 仓库
3. 配置 root directory: `backend`
4. 添加环境变量：
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_secret_key
   ```
5. 部署

#### 2.2 前端服务
1. 点击 "New" → "GitHub Repo"
2. 选择 `yunque-dada/lezao-scratch3.0-1` 仓库
3. 配置 root directory: `frontend`
4. 添加环境变量：
   ```
   VITE_API_BASE_URL=https://后端服务名称.up.railway.app
   ```
5. 部署

### 步骤3：配置域名（可选）

1. 在前端服务设置中添加自定义域名
2. 配置 SSL 证书（Railway 自动配置）

## 环境变量说明

### 后端环境变量
| 变量名 | 说明 | 示例 |
|--------|------|------|
| NODE_ENV | 运行环境 | production |
| PORT | 服务端口 | 3000 |
| MONGODB_URI | MongoDB连接字符串 | mongodb://... |
| JWT_SECRET | JWT密钥 | 随机字符串 |

### 前端环境变量
| 变量名 | 说明 | 示例 |
|--------|------|------|
| VITE_API_BASE_URL | 后端API地址 | https://backend-xxx.up.railway.app |

## 故障排查

### 502 Bad Gateway
- 检查后端服务是否正常运行
- 检查 MONGODB_URI 是否正确
- 查看后端日志确认MongoDB连接状态

### 前端无法访问API
- 检查 VITE_API_BASE_URL 是否正确配置
- 确认后端服务已启动
- 检查 CORS 配置

### MongoDB 连接失败
1. 确认 Railway 项目已添加 MongoDB 插件
2. 检查 MONGODB_URI 格式是否正确
3. 查看后端日志中的详细错误信息
