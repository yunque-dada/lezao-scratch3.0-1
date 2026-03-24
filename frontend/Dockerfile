FROM node:18-alpine

WORKDIR /app

# 复制 frontend 目录中的 package 文件
COPY frontend/package*.json ./frontend/

# 安装依赖
WORKDIR /app/frontend
RUN npm install

# 构建
RUN npm run build

# 暴露端口
EXPOSE 5173

# 启动命令
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
