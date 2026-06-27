#!/bin/bash

echo "========================================="
echo "  拓图 TuTu 项目启动脚本"
echo "========================================="
echo ""

# 检查是否已经安装依赖
if [ ! -d "tutu-app/node_modules" ]; then
    echo "正在安装前端依赖..."
    cd tutu-app && npm install && cd ..
fi

if [ ! -d "tutu-backend/node_modules" ]; then
    echo "正在安装后端依赖..."
    cd tutu-backend && npm install && cd ..
fi

echo ""
echo "启动后端服务..."
cd tutu-backend
npm run dev &
BACKEND_PID=$!
cd ..

sleep 2

echo "启动前端服务..."
cd tutu-app
npm run dev &
FRONTEND_PID=$!
cd ..

sleep 3

echo ""
echo "========================================="
echo "  服务启动成功！"
echo "========================================="
echo ""
echo "前端服务：http://localhost:5173/"
echo "后端服务：http://localhost:3001/"
echo ""
echo "按 Ctrl+C 停止所有服务"
echo ""

# 等待用户按下Ctrl+C
trap "echo ''; echo '正在停止服务...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" INT

wait