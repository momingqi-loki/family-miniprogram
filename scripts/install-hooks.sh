#!/bin/bash
# 安装 pre-commit 钩子
# 用法: ./scripts/install-hooks.sh

HOOKS_DIR=".git/hooks"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 创建 hooks 目录
mkdir -p "$HOOKS_DIR"

# 复制钩子脚本
cp "$SCRIPT_DIR/hooks/pre-commit" "$HOOKS_DIR/pre-commit"
chmod +x "$HOOKS_DIR/pre-commit"

echo "✅ Pre-commit hook installed!"
echo "   - JSON syntax validation"
echo "   - app.json structure check"
echo "   - Referenced files check"
echo "   - JavaScript syntax check"
