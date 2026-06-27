#!/bin/bash

# 拓图 TuTu 项目一键停止脚本

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
PID_DIR="$PROJECT_DIR/.pids"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}正在停止拓图服务...${NC}"

# 停止后端
BACKEND_PID_FILE="$PID_DIR/backend.pid"
if [ -f "$BACKEND_PID_FILE" ]; then
  PID=$(cat "$BACKEND_PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    echo -e "${GREEN}  ✓ 后端已停止 (PID: $PID)${NC}"
  else
    echo -e "${YELLOW}  后端进程不存在${NC}"
  fi
  rm -f "$BACKEND_PID_FILE"
fi

# 停止前端
FRONTEND_PID_FILE="$PID_DIR/frontend.pid"
if [ -f "$FRONTEND_PID_FILE" ]; then
  PID=$(cat "$FRONTEND_PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    echo -e "${GREEN}  ✓ 前端已停止 (PID: $PID)${NC}"
  else
    echo -e "${YELLOW}  前端进程不存在${NC}"
  fi
  rm -f "$FRONTEND_PID_FILE"
fi

echo ""
echo -e "${GREEN}全部服务已停止${NC}"
