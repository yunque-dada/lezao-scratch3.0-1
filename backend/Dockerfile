FROM node:18-alpine

WORKDIR /app

# 复制 backend 目录中的 package 文件
COPY backend/package*.json ./backend/

# 安装依赖
WORKDIR /app/backend
RUN npm install

# 复制源代码
COPY backend/ ./

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
