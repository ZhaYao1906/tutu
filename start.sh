#!/bin/bash

# 拓图 TuTu 项目一键启动脚本

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
JAVA_HOME="/Users/zhayao/Library/Java/JavaVirtualMachines/ms-17.0.17/Contents/Home"
PID_DIR="$PROJECT_DIR/.pids"

mkdir -p "$PID_DIR"

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}========================================${NC}"
echo -e "${CYAN}    拓图 TuTu 项目一键启动${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# 1. 检查并启动 MySQL
echo -e "${YELLOW}[1/4] 检查 MySQL 服务...${NC}"
if mysqladmin -u root -proot123 status &>/dev/null; then
  echo -e "${GREEN}  ✓ MySQL 已在运行${NC}"
else
  echo -e "${YELLOW}  启动 MySQL...${NC}"
  brew services start mysql 2>/dev/null
  sleep 3
  if mysqladmin -u root -proot123 status &>/dev/null; then
    echo -e "${GREEN}  ✓ MySQL 启动成功${NC}"
  else
    echo -e "${RED}  ✗ MySQL 启动失败，请手动检查${NC}"
    exit 1
  fi
fi
echo ""

# 2. 启动后端
echo -e "${YELLOW}[2/4] 启动 Java 后端服务...${NC}"
BACKEND_PID_FILE="$PID_DIR/backend.pid"
if [ -f "$BACKEND_PID_FILE" ] && kill -0 "$(cat "$BACKEND_PID_FILE")" 2>/dev/null; then
  echo -e "${YELLOW}  后端已在运行，先停止旧进程...${NC}"
  kill "$(cat "$BACKEND_PID_FILE")" 2>/dev/null
  sleep 2
fi

cd "$PROJECT_DIR/tutu-backend"
JAVA_HOME="$JAVA_HOME" nohup java -jar target/tutu-backend-1.0.0.jar > "$PID_DIR/backend.log" 2>&1 &
echo $! > "$BACKEND_PID_FILE"

# 等待后端启动
echo -e "${YELLOW}  等待后端启动...${NC}"
for i in $(seq 1 30); do
  if curl -s http://localhost:8080/api/spots | grep -q "[" 2>/dev/null; then
    echo -e "${GREEN}  ✓ 后端启动成功 (http://localhost:8080)${NC}"
    break
  fi
  if [ $i -eq 30 ]; then
    echo -e "${RED}  ✗ 后端启动超时，请查看日志: $PID_DIR/backend.log${NC}"
  fi
  sleep 1
done
echo ""

# 3. 启动前端
echo -e "${YELLOW}[3/4] 启动 React 前端服务...${NC}"
FRONTEND_PID_FILE="$PID_DIR/frontend.pid"
if [ -f "$FRONTEND_PID_FILE" ] && kill -0 "$(cat "$FRONTEND_PID_FILE")" 2>/dev/null; then
  echo -e "${YELLOW}  前端已在运行，先停止旧进程...${NC}"
  kill "$(cat "$FRONTEND_PID_FILE")" 2>/dev/null
  sleep 2
fi

cd "$PROJECT_DIR/tutu-app"
nohup npm run dev > "$PID_DIR/frontend.log" 2>&1 &
echo $! > "$FRONTEND_PID_FILE"

# 等待前端启动
echo -e "${YELLOW}  等待前端启动...${NC}"
for i in $(seq 1 20); do
  FRONTEND_URL=$(grep -oP 'http://localhost:\d+' "$PID_DIR/frontend.log" 2>/dev/null | head -1)
  if [ -n "$FRONTEND_URL" ]; then
    echo -e "${GREEN}  ✓ 前端启动成功 ($FRONTEND_URL)${NC}"
    break
  fi
  if [ $i -eq 20 ]; then
    echo -e "${RED}  ✗ 前端启动超时，请查看日志: $PID_DIR/frontend.log${NC}"
  fi
  sleep 1
done
echo ""

# 4. 完成
echo -e "${CYAN}========================================${NC}"
echo -e "${GREEN}  全部启动完成！${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""
echo -e "  前端地址: ${GREEN}$FRONTEND_URL${NC}"
echo -e "  后端地址: ${GREEN}http://localhost:8080${NC}"
echo -e "  测试账号: ${GREEN}test@tutu.com / 123456${NC}"
echo ""
echo -e "  停止服务: ${YELLOW}bash stop.sh${NC}"
echo ""
