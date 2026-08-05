#!/bin/bash
# 检查目标 skill 目录的基本健康状况
# 用法: bash check-skill.sh <skill-directory-path>

SKILL_DIR="${1:-.}"

echo "=== Skill 健康检查 ==="
echo ""

# 1. 检查 SKILL.md 是否存在
if [ ! -f "$SKILL_DIR/SKILL.md" ]; then
  echo "[FAIL] SKILL.md 不存在"
  exit 1
fi
echo "[OK] SKILL.md 存在"

# 2. 统计 SKILL.md 行数
LINE_COUNT=$(wc -l < "$SKILL_DIR/SKILL.md")
if [ "$LINE_COUNT" -gt 300 ]; then
  echo "[WARN] SKILL.md 有 ${LINE_COUNT} 行（建议 ≤ 300 行）"
else
  echo "[OK] SKILL.md ${LINE_COUNT} 行"
fi

# 3. 检查 references/ 下的文件是否都在相关文件列表中
if [ -d "$SKILL_DIR/references" ]; then
  echo ""
  echo "--- 相关文件列表检查 ---"
  for ref_file in "$SKILL_DIR"/references/*.md; do
    if [ -f "$ref_file" ]; then
      basename=$(basename "$ref_file")
      if grep -q "$basename" "$SKILL_DIR/SKILL.md"; then
        echo "[OK] $basename 已在相关文件列表中"
      else
        echo "[FAIL] $basename 未出现在 SKILL.md 的相关文件列表中"
      fi
    fi
  done
fi

# 4. 检查抽象词
echo ""
echo "--- 抽象词检查 ---"
ABSTRACT_WORDS="胶水|赋能|闭环|中台|一体化"
FOUND=$(grep -rn -E "$ABSTRACT_WORDS" "$SKILL_DIR" --include="*.md" || true)
if [ -z "$FOUND" ]; then
  echo "[OK] 未发现抽象词"
else
  echo "[WARN] 发现抽象词:"
  echo "$FOUND"
fi

# 5. 检查过程词
echo ""
echo "--- 过程词检查 ---"
PROCESS_WORDS="考虑|感觉|为什么|后续|可以再|讨论|方案|临时|暂时"
FOUND=$(grep -rn -E "$PROCESS_WORDS" "$SKILL_DIR" --include="*.md" || true)
if [ -z "$FOUND" ]; then
  echo "[OK] 未发现过程词"
else
  echo "[WARN] 发现过程词:"
  echo "$FOUND"
fi

echo ""
echo "=== 检查完成 ==="
