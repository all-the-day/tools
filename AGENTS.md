# 美味凉拌菜点菜系统

> 轻量级 Web 点菜应用，支持菜品图片上传和点菜记录管理

---

## 📋 项目概述

这是一个基于 Flask + React 的轻量级点菜系统，专为凉拌菜点菜场景设计。系统采用单页应用架构，前端使用 React 构建交互界面，后端使用 Flask 提供 RESTful API，数据存储采用 JSON 文件，无需数据库依赖。

**核心功能：**
- 📸 菜品图片上传与管理
- 📝 点菜记录的增删改查
- 📱 响应式设计，支持移动端访问
- 🎨 精美的 UI 设计，采用暖色调配色方案

---

## 🛠️ 技术栈

### 后端
- **Python 3.12.3** - 核心运行环境
- **Flask** - Web 框架
- **Werkzeug** - 文件上传处理

### 前端
- **React 18** - UI 框架（本地引用）
- **Babel** - JSX 编译器（本地引用）
- **Google Fonts** - 字体服务（Cormorant Garamond, Noto Sans SC）

### 数据存储
- **JSON 文件** - 轻量级数据持久化
- **本地文件系统** - 图片存储

---

## 📂 项目结构

```
/home/web_project/
├── server.py              # Flask 后端服务
├── index.html             # 单页应用前端（包含 React 代码和样式）
├── data.json              # 数据存储文件
├── AGENTS.md              # 项目上下文文档（本文件）
├── .gitignore             # Git 忽略规则
├── static/
│   ├── js/
│   │   ├── react.production.min.js       # React 核心库
│   │   ├── react-dom.production.min.js   # React DOM 库
│   │   └── babel.min.js                  # Babel 编译器
│   └── uploads/                          # 上传图片存储目录
│       └── dish_*.jpg                    # 菜品图片文件
└── venv/                                 # Python 虚拟环境
```

---

## 🚀 运行与构建

### 环境准备

```bash
# 激活虚拟环境
source venv/bin/activate

# 安装依赖（如果需要）
pip install flask werkzeug
```

### 启动服务

```bash
# 启动开发服务器
python server.py

# 或使用 Flask 命令
flask run --host=0.0.0.0 --port=5000
```

**访问地址：** http://localhost:5000

### 生产部署

```bash
# 使用 gunicorn（推荐）
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 server:app

# 或使用 waitress
pip install waitress
waitress-serve --port=5000 server:app
```

---

## 🔌 API 接口文档

### 基础路径
- **开发环境：** `http://localhost:5000`
- **API 前缀：** `/api`

### 接口列表

#### 1. 获取所有点菜记录
```http
GET /api/orders
```

**响应示例：**
```json
{
  "dishImage": "/static/uploads/dish_xxx.jpg",
  "orders": [
    {
      "id": "uuid",
      "name": "姓名",
      "dish": "菜品名称",
      "createdAt": "2026-04-24T15:08:48.996910",
      "updatedAt": "2026-04-24T15:09:15.298822"
    }
  ]
}
```

#### 2. 新增点菜记录
```http
POST /api/orders
Content-Type: application/json

{
  "name": "姓名",
  "dish": "菜品名称"
}
```

**响应示例：**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "name": "姓名",
    "dish": "菜品名称",
    "createdAt": "2026-04-24T15:08:48.996910"
  }
}
```

#### 3. 更新点菜记录
```http
PUT /api/orders/<order_id>
Content-Type: application/json

{
  "name": "新姓名",
  "dish": "新菜品名称"
}
```

#### 4. 删除点菜记录
```http
DELETE /api/orders/<order_id>
```

#### 5. 上传菜品图片
```http
POST /api/upload
Content-Type: multipart/form-data

image: [图片文件]
```

**支持格式：** PNG, JPG, JPEG, GIF, WEBP

**响应示例：**
```json
{
  "success": true,
  "image": "/static/uploads/dish_xxx.jpg"
}
```

---

## 💾 数据模型

### data.json 结构
```json
{
  "dishImage": "uploads/dish_xxx.jpg",
  "orders": [
    {
      "id": "uuid",
      "name": "string",
      "dish": "string",
      "createdAt": "ISO8601 datetime",
      "updatedAt": "ISO8601 datetime (optional)"
    }
  ]
}
```

### 字段说明
- `dishImage`: 当前菜品图片路径（相对于 static 目录）
- `orders`: 点菜记录数组
  - `id`: 唯一标识符（UUID）
  - `name`: 点菜人姓名
  - `dish`: 菜品名称
  - `createdAt`: 创建时间
  - `updatedAt`: 更新时间（可选）

---

## 📝 开发约定

### 代码风格
- **Python:** 遵循 PEP 8 规范
- **JavaScript:** 使用 ES6+ 语法，React 函数组件 + Hooks
- **注释:** 使用中文注释说明关键逻辑
- **命名:** 变量使用 camelCase，函数使用动词开头

### 文件组织
- 前端代码集中在 `index.html` 中（单文件应用）
- 后端代码集中在 `server.py` 中
- 静态资源存放在 `static/` 目录

### Git 提交规范
```
<类型>: <描述>

类型：
- feat: 新功能
- fix: 修复 bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 重构
- test: 测试相关
- chore: 构建/工具相关
```

### 安全注意事项
- 文件上传限制为图片格式
- 使用 `secure_filename` 处理上传文件名
- 输入数据经过 trim 处理
- 删除操作需要用户确认

---

## 🎨 UI 设计规范

### 配色方案
```css
--cream: #F5F1E8;           /* 奶油色背景 */
--warm-white: #FFFEF9;      /* 暖白色 */
--deep-brown: #3E2723;      /* 深棕色文字 */
--medium-brown: #5D4037;    /* 中棕色 */
--light-brown: #8D6E63;     /* 浅棕色 */
--gold: #D4A574;            /* 金色强调 */
--gold-light: #E8C9A0;      /* 浅金色 */
--accent-red: #C62828;      /* 强调红色 */
```

### 字体
- **标题:** Cormorant Garamond (衬线体)
- **正文:** Noto Sans SC (无衬线体)

### 动画
- 使用 CSS 动画实现平滑过渡
- 支持 fadeIn, slideIn, bounce 等效果
- 移动端优化触摸区域（最小 44px）

---

## 🔧 常见问题

### Q: 如何修改端口？
A: 修改 `server.py` 最后一行的 `port=5000` 参数。

### Q: 如何清空数据？
A: 删除 `data.json` 文件，系统会自动创建空数据。

### Q: 如何备份数据？
A: 复制 `data.json` 和 `static/uploads/` 目录即可。

### Q: 图片上传失败？
A: 检查 `static/uploads/` 目录权限，确保可写入。

---

## 📦 依赖管理

### 当前依赖
```
Flask>=2.0.0
Werkzeug>=2.0.0
```

### 安装依赖
```bash
pip install -r requirements.txt  # 如果存在 requirements.txt
# 或手动安装
pip install flask werkzeug
```

---

## 🌐 部署建议

### 使用 Caddy 反向代理
```caddyfile
点菜系统.example.com {
    reverse_proxy localhost:5000
}
```

### 使用 systemd 服务
```ini
[Unit]
Description=Dish Order System
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/web_project
ExecStart=/home/web_project/venv/bin/python server.py
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## 📊 性能优化建议

1. **前端优化**
   - React 已使用生产版本（.production.min.js）
   - 图片使用懒加载
   - CSS 动画使用 GPU 加速

2. **后端优化**
   - 生产环境关闭 debug 模式
   - 使用 gunicorn 多进程
   - 考虑添加缓存机制

3. **存储优化**
   - 定期清理旧图片
   - 考虑图片压缩
   - 大数据量时迁移到数据库

---

## 🔐 安全加固

- [ ] 添加请求频率限制
- [ ] 实现用户认证机制
- [ ] 添加 CSRF 保护
- [ ] 限制上传文件大小
- [ ] 添加日志记录

---

## 📈 未来规划

- [ ] 支持多菜品管理
- [ ] 添加用户登录功能
- [ ] 实现数据统计和导出
- [ ] 支持微信小程序
- [ ] 添加消息通知功能

---

*最后更新: 2026-04-24*
*项目版本: 1.0.0*
*维护者: iFlow CLI*