# 🌙 Dreamio Cloud Bath - ChatGPT Code Interpreter Guide

本指南专为 **ChatGPT Code Interpreter (Advanced Data Analysis)** 定制。无论您是在网页端把文件/压缩包上传给 ChatGPT，还是让它编写 Python 脚本自动批量修改，都能立刻生效并直接运行验证。

---

## 📁 核心文件结构

本压缩包包含两套完全同步的代码形态：

### 1. 🌟 `pixel-cloud-bath.html`（极力推荐：ChatGPT 最擅长修改的形态）
- **特点**：**单文件、零依赖、纯原生 HTML5/JS/Canvas/WebAudio**。
- **为什么推荐 ChatGPT 改这个**：ChatGPT Code Interpreter 运行在独立的沙盒中，无法启动 Node.js 服务器预览。但对于单文件 HTML，**ChatGPT 可以直接读取、用 Python 修改里面的任何参数/关卡/物理引擎/美术，然后生成新的 HTML 文件供您一键下载双击打开**！
- **完全等同于 Next.js 版本**：包含 1:1 像素小人、梦幻天空城全屏画风、彩色云朵挖掘、水流模拟、小黄鸭收集以及胜利判定。

### 2. ⚛️ `src/components/pixel-bath/`（Next.js React 原版组件库）
- 如果您希望将 ChatGPT 修改好的逻辑同步回 Arcade 网站工程，相关模块为：
  - `pixel-girl.tsx`: 1:1 像素小人及温泉云台 SVG
  - `game-board.tsx`: Canvas 画布渲染与水流挖掘主循环
  - `levels.ts`: 关卡网格与云层分布
  - `types.ts`: 格子类型 (`CELL_CLOUD_WHITE`, `CELL_CLOUD_PINK` 等)
  - `audio.ts`: Web Audio 合成器音效

---

## 🎮 如何让 ChatGPT 修改游戏？

### 典型 Prompt 示例（直接复制发给 ChatGPT）：

#### 场景 1：调整关卡或新增关卡
> "请帮我修改 `pixel-cloud-bath.html` 中的 `LEVELS` 数组。我想增加第 4 关，关卡里要有更多爱心形状的粉色云朵（CELL_CLOUD_PINK: 4）和多只小黄鸭（CELL_DUCK: 7），并在右下角放置洗澡盆（CELL_TUB: 3）。修改后输出完整的可运行 HTML 文件供我下载。"

#### 场景 2：修改水流手感与挖掘范围
> "请帮我调整 `pixel-cloud-bath.html` 里的挖掘手感：
> 1. 将鼠标挖掘半径 `digRadius` 从 28 调整为 40，让挖掘更爽快；
> 2. 让水流流速更快，水滴粒子更密集；
> 3. 修改完成后输出修改后的 HTML 文件。"

#### 场景 3：更换或微调背景颜色与特效
> "请查看 `pixel-cloud-bath.html` 里的 `drawBackground` 函数，帮我把夜空渐变色改成更加梦幻的极光极夜风格，并增加几颗划过的流星动画。修改后给我提供完整的 HTML。"

---

## 🧩 核心代码坐标一览（便于指定 ChatGPT 精确定位）

在 `pixel-cloud-bath.html` 内：
- **小人与浴缸 SVG 渲染**：搜索 `const PIXEL_GIRL_SVG`
- **云朵类型常量**：
  - `0`: 空气 (`CELL_AIR`)
  - `1`: 经典白云 (`CELL_CLOUD_WHITE`)
  - `2`: 神殿硬石（不可破坏）(`CELL_STONE`)
  - `3`: 云中温泉浴盆（目标终点）(`CELL_TUB`)
  - `4`: 梦幻粉云 (`CELL_CLOUD_PINK`)
  - `5`: 梦幻薰衣草紫云 (`CELL_CLOUD_LAVENDER`)
  - `6`: 梦幻蜜桃金云 (`CELL_CLOUD_PEACH`)
  - `7`: 闪烁小鸭 (`CELL_DUCK`)
- **关卡生成函数**：搜索 `const LEVELS = [...]`
- **水流物理引擎**：搜索 `function updateWater()`
- **鼠标挖掘逻辑**：搜索 `function digAt(gridX, gridY, radius)`
- **天空背景绘制**：搜索 `function drawBackground()`

---

## 🚀 本地查看与验证方式

1. **单文件直接双击**：双击 `pixel-cloud-bath.html` 直接在任何浏览器全屏运行，无需任何环境。
2. **Next.js 工程模式**：
   ```bash
   npm run dev
   ```
   访问 `http://localhost:3000/games/game-1`（Next.js 原生页面）或 `http://localhost:3000/pixel-cloud-bath.html`（静态极速页面）。
