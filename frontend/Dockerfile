FROM node:18-alpine

WORKDIR /app

# 先复制整个项目
COPY . .

# 进入 frontend 目录
WORKDIR /app/frontend

# 安装依赖
RUN npm install

# 构建
RUN npm run build

# 暴露端口
EXPOSE 5173

# 启动命令
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
