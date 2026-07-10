# 工作计划看板

一个无需构建步骤和后端服务的中文工作计划看板。任务保存在浏览器 `localStorage` 中，支持月历、四象限任务视图、筛选、编辑以及 JSON 导入导出。

## 功能

- 按计划日期、截止日期和逾期状态汇总任务
- 四象限重要程度看板
- 任务新增、编辑、完成、取消和删除
- 关键词、重要程度和状态筛选
- JSON 数据导入与导出
- 响应式桌面和移动端布局

## 运行

直接打开 `index.html` 即可使用。也可以在 Windows PowerShell 中启动本地静态服务器：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\start-server.ps1"
```

然后访问 <http://127.0.0.1:8000/>。

查看或停止服务器：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\server-status.ps1"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\stop-server.ps1"
```

## 配置

默认配置无需 `.env` 文件。需要修改主机、端口或日志目录时，复制示例文件后编辑：

```powershell
Copy-Item .env.example .env
```

`.env` 属于本地配置，不会提交到 Git。

## 数据说明

任务数据仅保存在当前浏览器的 `localStorage` 中，存储键为 `work-plan-dashboard-v1`。更换浏览器或清理浏览器数据前，建议先使用页面中的“导出 JSON”。

## 项目结构

- `index.html`：页面结构
- `styles.css`：界面样式与响应式布局
- `app.js`：任务模型、日历、筛选、导入导出和本地存储
- `start-server.ps1`：启动本地静态服务器
- `server-status.ps1`：检查服务状态
- `stop-server.ps1`：停止本地静态服务器
- `docs/`：设计与实现记录

## 基础检查

```powershell
node --check ".\app.js"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File ".\server-status.ps1"
```
