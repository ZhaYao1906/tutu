#!/bin/bash

# 拓图 TuTu 项目一键停止脚本

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_DIR="$PROJECT_DIR/.pids"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}正在停止拓图服务...${NC}"

# 通过 PID 文件停止后端
BACKEND_PID_FILE="$PID_DIR/backend.pid"
if [ -f "$BACKEND_PID_FILE" ]; then
  PID=$(cat "$BACKEND_PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    echo -e "${GREEN}  ✓ 后端已停止 (PID: $PID)${NC}"
  fi
  rm -f "$BACKEND_PID_FILE"
fi

# 通过端口停止后端（兜底）
PORT_PID=$(lsof -ti:8080 2>/dev/null)
if [ -n "$PORT_PID" ]; then
  kill -9 "$PORT_PID" 2>/dev/null
  echo -e "${GREEN}  ✓ 端口 8080 进程已清理 (PID: $PORT_PID)${NC}"
fi

# 通过 PID 文件停止前端
FRONTEND_PID_FILE="$PID_DIR/frontend.pid"
if [ -f "$FRONTEND_PID_FILE" ]; then
  PID=$(cat "$FRONTEND_PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    echo -e "${GREEN}  ✓ 前端已停止 (PID: $PID)${NC}"
  fi
  rm -f "$FRONTEND_PID_FILE"
fi

# 通过端口停止前端（兜底）
for port in 5173 5174 5175 5176 5177 5178 5179; do
  PORT_PID=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$PORT_PID" ]; then
    kill -9 "$PORT_PID" 2>/dev/null
    echo -e "${GREEN}  ✓ 端口 $port 进程已清理 (PID: $PORT_PID)${NC}"
  fi
done

echo ""
echo -e "${GREEN}全部服务已停止${NC}"
