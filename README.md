# 烙馍智擎中央模板库

烙馍智擎本地模板库网站，使用 Vue 3 + Vite 3 开发，支持搜索、筛选和一键下载模板文件。

## 功能特性

- 收录 305 个免费模板（数据大屏、仪表板、应用）
- 所有模板截图和模板文件均已下载到本地
- 支持按模板类型、分类、行业标签筛选
- 支持关键词实时搜索
- 响应式卡片网格布局
- 模板详情页展示多截图和文件下载
- 静态站点输出，可直接部署到任意 Web 服务器

## 技术栈

- Vue 3（Composition API + `<script setup>`）
- Vue Router 4
- Pinia
- Vite 3
- Tailwind CSS 3

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 抓取模板数据（下载截图和模板文件到 public/）
npm run fetch:data

# 3. 启动开发服务器
npm run dev

# 4. 生产构建
npm run build
```

构建产物位于 `dist/` 目录，可直接部署。

## 项目结构

```
.
├── docs/                    # 原始需求文档
├── scripts/
│   └── fetch-templates.mjs  # 数据抓取脚本
├── public/
│   ├── uploads/             # 模板截图、Logo（自动生成，已忽略 git）
│   └── templates/           # 模板文件（.DET/.DET2APP 等，自动生成，已忽略 git）
├── src/
│   ├── assets/styles/       # Tailwind / 全局样式
│   ├── components/          # 页面组件
│   ├── constants/labels.js  # 类型/标签中英文映射
│   ├── data/templates.json  # 本地化模板索引（自动生成）
│   ├── router/              # Vue Router
│   ├── stores/              # Pinia store
│   ├── views/               # 页面视图
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 数据说明

模板元数据、截图和文件来源于 https://templates.luomor.com/，仅供学习、研究和内部使用。请勿用于商业分发。

执行 `npm run fetch:data` 时会：

1. 调用 Halo 应用商店 API 获取全部模板元数据
2. 下载截图到 `public/uploads/`
3. 下载模板文件到 `public/templates/`
4. 生成本地化索引 `src/data/templates.json`
5. 记录下载失败的资源到 `scripts/failed.log`

## 部署

### 静态服务器

将 `dist/` 目录部署到任意静态文件服务器即可：

```bash
npx serve -s dist
```

### Nginx

```nginx
server {
    listen 80;
    server_name templates.example.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> 注意：由于本项目是单页应用（SPA），必须配置 fallback 到 `index.html`，否则详情页刷新会 404。

## 常见问题

1. **为什么 `npm run fetch:data` 有部分文件下载失败？**
   目标站点个别资源本身已 404 或指向内网地址（如 `http://192.168.x.x`），这些资源无法下载。失败记录会保存到 `scripts/failed.log`。

2. **公共资源是否纳入 Git 管理？**
   `public/uploads/` 和 `public/templates/` 已加入 `.gitignore`。新环境只需重新执行 `npm run fetch:data` 即可恢复资源。

## License

本项目代码遵循 MIT 协议。模板资源版权归原作者所有，仅用于学习和研究目的。
